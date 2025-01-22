import { SignUpDto } from '../src/auth/dtos/sign-up.dto';
import { MovieDto } from '../src/movie-management/application/dtos/movie.dto';
import { UserRole } from '../src/shared/roles/user-role.enum';
import { TestSetup } from './setup/e2e-test.setup';

describe('Movie Management (E2E)', () => {
  const setup = new TestSetup();

  let managerToken: string;
  let customerId: string;
  let customerToken: string;

  beforeAll(async () => {
    await setup.init();

    const newManager: SignUpDto = {
      username: 'manager',
      password: 'secret',
      age: 25,
      role: UserRole.Manager,
    };
    const newCustomer: SignUpDto = {
      username: 'customer',
      password: 'secret',
      age: 20,
      role: UserRole.Customer,
    };

    await setup.request.post('/auth/signup').send(newManager).expect(201);
    await setup.request.post('/auth/signup').send(newCustomer).expect(201);

    const managerResponse = await setup.request
      .post('/auth/login')
      .send({ username: newManager.username, password: newManager.password })
      .expect(200);

    const customerResponse = await setup.request
      .post('/auth/login')
      .send({ username: newCustomer.username, password: newCustomer.password })
      .expect(200);

    expect(managerResponse.body).toEqual({
      access_token: expect.any(String),
    });

    managerToken = managerResponse.body.access_token;
    customerToken = customerResponse.body.access_token;

    const profileResponse = await setup.request
      .get('/users/profile')
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(200);

    customerId = profileResponse.body.userId;
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

      const response = await setup.request
        .post('/movies')
        .set('Authorization', `Bearer ${managerToken}`)
        .send(newMovie)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        name: 'Vertigo',
        ageRestriction: 13,
        sessions: [
          {
            date: new Date('2025-01-20').toISOString(),
            roomName: 'Room A',
            timeSlotStart: '14:00',
            timeSlotEnd: '16:00',
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

      const createResponse = await setup.request
        .post('/movies')
        .set('Authorization', `Bearer ${managerToken}`)
        .send(newMovie)
        .expect(201);

      const movieId = createResponse.body.id;

      const movieToUpdate: Partial<MovieDto> = {
        name: 'Psycho (Updated)',
        ageRestriction: 18,
      };

      await setup.request
        .patch(`/movies/${movieId}`)
        .set('Authorization', `Bearer ${managerToken}`)
        .send(movieToUpdate)
        .expect(200);

      const updateResponse = await setup.request
        .get(`/movies/${movieId}`)
        .set('Authorization', `Bearer ${managerToken}`)
        .expect(200);

      expect(updateResponse.body).toMatchObject({
        id: movieId,
        name: 'Psycho (Updated)',
        ageRestriction: 18,
      });
    });

    it.skip('should delete an existing movie', async () => {
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

      const createResponse = await setup.request
        .post('/movies')
        .set('Authorization', `Bearer ${managerToken}`)
        .send(newMovie)
        .expect(201);

      const movieId = createResponse.body.id;

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

      const movieResponse = await setup.request
        .post('/movies')
        .set('Authorization', `Bearer ${managerToken}`)
        .send(newMovie)
        .expect(201);

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

      const movieResponse = await setup.request
        .post('/movies')
        .set('Authorization', `Bearer ${managerToken}`)
        .send(newMovie)
        .expect(201);

      const sessionId = movieResponse.body.sessions[0].id;

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

  describe('Validation and Error Handling', () => {
    it('should return 400 for invalid movie data', async () => {
      const invalidMovie = {
        name: '', // Invalid name
        ageRestriction: -5, // Invalid age restriction
        sessions: [], // No sessions
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
