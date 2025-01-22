import { SignUpDto } from '../src/auth/dtos/sign-up.dto';
import { MovieDto } from '../src/movie-management/application/dtos/movie.dto';
import { UserRole } from '../src/shared/roles/user-role.enum';
import { TestSetup } from './setup/e2e-test.setup';

describe('Movie Management (E2E)', () => {
  const setup = new TestSetup();
  let managerToken: string;

  beforeAll(async () => {
    await setup.init();

    const newManager: SignUpDto = {
      username: 'manager',
      password: 'secret',
      age: 25,
      role: UserRole.Manager,
    };

    await setup.request.post('/auth/signup').send(newManager).expect(201);

    const response = await setup.request
      .post('/auth/login')
      .send({ username: newManager.username, password: newManager.password })
      .expect(200);

    expect(response.body).toEqual({
      access_token: expect.any(String),
    });

    managerToken = response.body.access_token;
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
