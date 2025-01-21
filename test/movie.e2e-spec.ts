import { SignUpDto } from '../src/auth/dtos/sign-up.dto';
import { UserRole } from '../src/shared/roles/user-role.enum';
import { MovieDto } from '../src/movie-management/application/dtos/movie.dto';
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

  beforeEach(async () => {
    // await setup.clearDatabase();
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
  });
});
