import { UserRole } from '../src/shared/roles/user-role.enum';
import { SignUpDto } from '../src/auth/dtos/sign-up.dto';
import { LoginDto } from '../src/auth/dtos/login.dto';
import { TestSetup } from './setup/e2e-test.setup';

describe('Auth (E2E)', () => {
  const setup = new TestSetup();

  beforeAll(async () => {
    await setup.init();
  });

  beforeEach(async () => {
    await setup.clearDatabase();
  });

  afterAll(async () => {
    await setup.teardown();
  });

  describe('sign-up', () => {
    it('should register a new user successfully', async () => {
      const newCustomer: SignUpDto = {
        username: 'customer',
        password: 'secret',
        age: 25,
        role: UserRole.Customer,
      };

      const response = await setup.request
        .post('/auth/signup')
        .send(newCustomer)
        .expect(201);

      expect(response.body).toEqual({});
    });

    it('should return 400 for missing required fields', async () => {
      const invalidSignup: Partial<SignUpDto> = {
        username: '',
        password: 'secret',
        age: 25,
      };

      const response = await setup.request
        .post('/auth/signup')
        .send(invalidSignup)
        .expect(400);

      expect(response.body.message).toContain('username should not be empty');
      expect(response.body.message).toContain(
        'role must be one of the following values: Customer, Manager',
      );
    });

    it('should return 400 for invalid age', async () => {
      const invalidSignup: SignUpDto = {
        username: 'user',
        password: 'secret',
        age: -5,
        role: UserRole.Customer,
      };

      const response = await setup.request
        .post('/auth/signup')
        .send(invalidSignup)
        .expect(400);

      expect(response.body.message).toContain('age must not be less than 0');
    });

    it('should return 400 for invalid role', async () => {
      const invalidSignup: SignUpDto = {
        username: 'user',
        password: 'secret',
        age: 10,
        role: '-' as UserRole,
      };

      const response = await setup.request
        .post('/auth/signup')
        .send(invalidSignup)
        .expect(400);

      expect(response.body.message).toContain(
        'role must be one of the following values: Customer, Manager',
      );
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const newCustomerDto: SignUpDto = {
        username: 'customer',
        password: 'secret',
        age: 30,
        role: UserRole.Customer,
      };

      const loginDto: LoginDto = {
        username: newCustomerDto.username,
        password: newCustomerDto.password,
      };

      await setup.request.post('/auth/signup').send(newCustomerDto).expect(201);

      const response = await setup.request
        .post('/auth/login')
        .send(loginDto)
        .expect(200);

      expect(response.body).toEqual({
        access_token: expect.any(String),
      });
    });

    it('should return 401 for invalid credentials', async () => {
      const invalidCredentials: LoginDto = {
        username: 'nonexistentuser',
        password: 'wrongpassword',
      };

      const response = await setup.request
        .post('/auth/login')
        .send(invalidCredentials)
        .expect(401);

      expect(response.body.message).toEqual('Unauthorized');
    });

    it('should return 400 for missing fields', async () => {
      const invalidLogin: Partial<LoginDto> = {
        username: '',
      };

      const response = await setup.request
        .post('/auth/login')
        .send(invalidLogin)
        .expect(400);

      expect(response.body.message).toContain('password must be a string');
    });
  });
});
