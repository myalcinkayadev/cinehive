import { SignUpDto } from '../src/auth/dtos/sign-up.dto';
import { MovieDto } from '../src/movie-management/application/dtos/movie.dto';
import { UserRole } from '../src/shared/roles/user-role.enum';
import { TestSetup } from './setup/e2e-test.setup';

describe('Movie Management (E2E)', () => {
  const setup = new TestSetup();

  let managerToken: string;
  let customerToken: string;
  let customerId: string;

  const createUserAndLogin = async (signUpDto: SignUpDto) => {
    await setup.request.post('/auth/signup').send(signUpDto).expect(201);
    const response = await setup.request
      .post('/auth/login')
      .send({ username: signUpDto.username, password: signUpDto.password })
      .expect(200);

    return response.body.access_token;
  };

  const createMovie = async (movieDto: MovieDto, token: string) => {
    const response = await setup.request
      .post('/movies')
      .set('Authorization', `Bearer ${token}`)
      .send(movieDto)
      .expect(201);

    return response.body;
  };

  const getUserProfile = async (token: string) => {
    const response = await setup.request
      .get('/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    return response.body;
  };

  beforeAll(async () => {
    await setup.init();

    const manager: SignUpDto = {
      username: 'manager',
      password: 'secret',
      age: 25,
      role: UserRole.Manager,
    };
    const customer: SignUpDto = {
      username: 'customer',
      password: 'secret',
      age: 20,
      role: UserRole.Customer,
    };

    managerToken = await createUserAndLogin(manager);
    customerToken = await createUserAndLogin(customer);

    const customerProfile = await getUserProfile(customerToken);
    customerId = customerProfile.userId;
  });

  afterAll(async () => {
    await setup.teardown();
  });

  describe('CRUD Operations', () => {
    it('should create a new movie', async () => {
      const newMovie: MovieDto = {
        name: 'Vertigo',
        ageRestriction: 13,
        sessions: [
          {
            date: '2025-01-20',
            timeSlotStart: '14:00',
            timeSlotEnd: '16:00',
            roomName: 'Room A',
          },
        ],
      };

      const response = await createMovie(newMovie, managerToken);

      expect(response).toMatchObject({
        id: expect.any(String),
        name: 'Vertigo',
        ageRestriction: 13,
        sessions: [
          {
            date: new Date('2025-01-20').toISOString(),
            timeSlotStart: '14:00',
            timeSlotEnd: '16:00',
            roomName: 'Room A',
          },
        ],
      });
    });

    it('should retrieve all movies', async () => {
      const response = await setup.request
        .get('/movies')
        .set('Authorization', `Bearer ${managerToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should update an existing movie', async () => {
      const newMovie: MovieDto = {
        name: 'Psycho',
        ageRestriction: 16,
        sessions: [
          {
            date: '2025-02-10',
            timeSlotStart: '15:00',
            timeSlotEnd: '17:00',
            roomName: 'Room B',
          },
        ],
      };

      const createdMovie = await createMovie(newMovie, managerToken);
      const movieId = createdMovie.id;

      const updatedDetails = {
        name: 'Psycho (Updated)',
        ageRestriction: 18,
      };

      await setup.request
        .patch(`/movies/${movieId}`)
        .set('Authorization', `Bearer ${managerToken}`)
        .send(updatedDetails)
        .expect(200);

      const updatedMovie = await setup.request
        .get(`/movies/${movieId}`)
        .set('Authorization', `Bearer ${managerToken}`)
        .expect(200);

      expect(updatedMovie.body).toMatchObject({
        id: movieId,
        name: 'Psycho (Updated)',
        ageRestriction: 18,
      });
    });

    it('should delete an existing movie', async () => {
      const newMovie: MovieDto = {
        name: 'Inception',
        ageRestriction: 13,
        sessions: [
          {
            date: '2025-03-15',
            timeSlotStart: '10:00',
            timeSlotEnd: '12:00',
            roomName: 'Room C',
          },
        ],
      };

      const createdMovie = await createMovie(newMovie, managerToken);
      const movieId = createdMovie.id;

      await setup.request
        .delete(`/movies/${movieId}`)
        .set('Authorization', `Bearer ${managerToken}`)
        .expect(200);

      await setup.request
        .get(`/movies/${movieId}`)
        .set('Authorization', `Bearer ${managerToken}`)
        .expect(404);
    });
  });

  describe('Ticket Operations', () => {
    it('should allow a customer to buy a ticket', async () => {
      const newMovie: MovieDto = {
        name: 'Batman',
        ageRestriction: 18,
        sessions: [
          {
            date: '2025-03-15',
            timeSlotStart: '10:00',
            timeSlotEnd: '12:00',
            roomName: 'Room C',
          },
        ],
      };

      const movieResponse = await createMovie(newMovie, managerToken);
      const sessionId = movieResponse.sessions[0].id;

      const ticketRequest = {
        userId: customerId,
        sessionId,
      };

      const ticketResponse = await setup.request
        .post('/tickets')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(ticketRequest)
        .expect(201);

      expect(ticketResponse.body).toMatchObject({
        id: expect.any(String),
        userId: customerId,
        sessionId: sessionId,
      });
    });

    it('should return 400 when trying to buy a ticket for a non-existent session', async () => {
      const ticketRequest = {
        userId: customerId,
        sessionId: 'nonExistentSessionId',
      };

      const response = await setup.request
        .post('/tickets')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(ticketRequest)
        .expect(404);

      expect(response.body.message).toBe(
        'Session nonExistentSessionId is not found',
      );
    });

    it('should return 403 when a customer tries to buy a ticket with age restriction not met', async () => {
      const newMovie: MovieDto = {
        name: 'The Godfather',
        ageRestriction: 25,
        sessions: [
          {
            date: '2025-05-20',
            timeSlotStart: '18:00',
            timeSlotEnd: '20:00',
            roomName: 'Room D',
          },
        ],
      };

      const movieResponse = await createMovie(newMovie, managerToken);
      const sessionId = movieResponse.sessions[0].id;

      const ticketRequest = {
        userId: customerId,
        sessionId,
      };

      const response = await setup.request
        .post('/tickets')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(ticketRequest)
        .expect(403);

      expect(response.body.message).toBe(
        'User does not meet the age restriction for this movie.',
      );
    });
  });

  describe('Watch Operations', () => {
    it('should allow a customer to watch a movie', async () => {
      const newMovie: MovieDto = {
        name: 'Avatar',
        ageRestriction: 13,
        sessions: [
          {
            date: '2025-04-10',
            timeSlotStart: '18:00',
            timeSlotEnd: '20:00',
            roomName: 'Room E',
          },
        ],
      };

      const movieResponse = await setup.request
        .post('/movies')
        .set('Authorization', `Bearer ${managerToken}`)
        .send(newMovie)
        .expect(201);

      const movieId = movieResponse.body.id;
      const sessionId = movieResponse.body.sessions[0].id;

      const ticketRequest = {
        userId: customerId,
        sessionId,
      };

      const ticketResponse = await setup.request
        .post('/tickets')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(ticketRequest)
        .expect(201);

      const watchMovieRequest = {
        movieId,
        ticketId: ticketResponse.body.id,
      };

      const watchResponse = await setup.request
        .post(`/movies/${movieId}/watch`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send(watchMovieRequest)
        .expect(200);

      expect(watchResponse.body).toMatchObject({
        message: 'Enjoy the movie!',
      });
    });

    it('should return 403 when a customer tries to watch a movie without a valid ticket', async () => {
      const newMovie: MovieDto = {
        name: 'The Matrix',
        ageRestriction: 13,
        sessions: [
          {
            date: '2025-06-10',
            timeSlotStart: '20:00',
            timeSlotEnd: '22:00',
            roomName: 'Room F',
          },
        ],
      };

      const movieResponse = await setup.request
        .post('/movies')
        .set('Authorization', `Bearer ${managerToken}`)
        .send(newMovie)
        .expect(201);

      const movieId = movieResponse.body.id;

      const watchMovieRequest = {
        movieId,
        ticketId: 'invalidTicketId',
      };

      const watchResponse = await setup.request
        .post(`/movies/${movieId}/watch`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send(watchMovieRequest)
        .expect(403);

      expect(watchResponse.body.message).toBe(
        'Invalid or missing ticket for this movie.',
      );
    });
  });

  describe('Watch History Operations', () => {
    it('should return an empty watch history for a new customer', async () => {
      const newCustomer: SignUpDto = {
        username: 'customer_for_watch-history',
        password: 'secret',
        age: 30,
        role: UserRole.Customer,
      };
      const newCustomerToken = await createUserAndLogin(newCustomer);

      const response = await setup.request
        .get('/users/profile/watch-history')
        .set('Authorization', `Bearer ${newCustomerToken}`)
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return a populated watch history after watching a movie', async () => {
      const newMovie: MovieDto = {
        name: 'Interstellar',
        ageRestriction: 13,
        sessions: [
          {
            date: '2025-07-15',
            timeSlotStart: '19:00',
            timeSlotEnd: '22:00',
            roomName: 'Room G',
          },
        ],
      };

      const movieResponse = await createMovie(newMovie, managerToken);
      const movieId = movieResponse.id;
      const sessionId = movieResponse.sessions[0].id;

      const ticketRequest = {
        userId: customerId,
        sessionId,
      };

      const ticketResponse = await setup.request
        .post('/tickets')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(ticketRequest)
        .expect(201);

      const watchMovieRequest = {
        movieId,
        ticketId: ticketResponse.body.id,
      };

      await setup.request
        .post(`/movies/${movieId}/watch`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send(watchMovieRequest)
        .expect(200);

      const historyResponse = await setup.request
        .get('/users/profile/watch-history')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      expect(historyResponse.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            movieId,
            ticketId: watchMovieRequest.ticketId,
            userId: customerId,
            watchedAt: expect.any(String),
          }),
        ]),
      );
    });

    it('should return 401 for unauthorized access to watch history', async () => {
      const response = await setup.request
        .get('/users/profile/watch-history')
        .expect(401);

      expect(response.body.message).toBe('Unauthorized');
    });
  });

  describe('Validation and Error Handling', () => {
    it('should return 400 for invalid movie data', async () => {
      const invalidMovie = {
        name: '',
        ageRestriction: -5,
        sessions: [],
      };

      const response = await setup.request
        .post('/movies')
        .set('Authorization', `Bearer ${managerToken}`)
        .send(invalidMovie)
        .expect(400);

      expect(response.body.message).toEqual(
        expect.arrayContaining([
          'name should not be empty',
          'ageRestriction must not be less than 0',
          'sessions must contain at least 1 elements',
        ]),
      );
    });

    it('should return 401 for unauthorized access', async () => {
      const response = await setup.request
        .post('/movies')
        .send({
          name: 'Unauthorized Movie',
          ageRestriction: 13,
          sessions: [
            {
              date: '2025-04-10',
              timeSlotStart: '12:00',
              timeSlotEnd: '14:00',
              roomName: 'Room D',
            },
          ],
        })
        .expect(401);

      expect(response.body.message).toBe('Unauthorized');
    });
  });
});
