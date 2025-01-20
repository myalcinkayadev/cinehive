import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { MikroORM } from '@mikro-orm/core';
import { UserRole } from '../src/shared/roles/user-role.enum';
import { SignUpDto } from '../src/auth/dtos/sign-up.dto';
import { LoginDto } from 'src/auth/dtos/login.dto';

describe('Auth (E2E)', () => {
  let app: INestApplication;
  let orm: MikroORM;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    orm = moduleRef.get<MikroORM>(MikroORM);
    await orm.getSchemaGenerator().dropSchema();
    await orm.getSchemaGenerator().createSchema();
  });

  beforeEach(async () => {
    const schemaGenerator = orm.getSchemaGenerator();
    await schemaGenerator.refreshDatabase();
  });

  afterAll(async () => {
    await orm.close();
    await app.close();
  });

  describe('sign-up', () => {
    it('should register a new user successfully', async () => {
      const newCustomer: SignUpDto = {
        username: 'customer1',
        password: 'secure_password',
        age: 25,
        role: UserRole.Customer,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(newCustomer)
        .expect(201);

      expect(response.body).toEqual({});
    });

    it('should return 400 for missing required fields', async () => {
      const invalidSignup: Partial<SignUpDto> = {
        username: '',
        password: 'secure_password',
        age: 25,
      };

      const response = await request(app.getHttpServer())
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
        username: 'testuser',
        password: 'supersecret',
        age: -5,
        role: UserRole.Customer,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(invalidSignup)
        .expect(400);

      expect(response.body.message).toContain('age must not be less than 0');
    });

    it('should return 400 for invalid role', async () => {
      const invalidSignup: SignUpDto = {
        username: 'testuser',
        password: 'supersecret',
        age: 10,
        role: '-' as UserRole,
      };

      const response = await request(app.getHttpServer())
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
        password: 'supersecret',
        age: 30,
        role: UserRole.Customer,
      };

      const loginDto: LoginDto = {
        username: newCustomerDto.username,
        password: newCustomerDto.password,
      };

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(newCustomerDto)
        .expect(201);

      const response = await request(app.getHttpServer())
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

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(invalidCredentials)
        .expect(401);

      expect(response.body.message).toEqual('Unauthorized');
    });

    it('should return 400 for missing fields', async () => {
      const invalidLogin: Partial<LoginDto> = {
        username: '',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(invalidLogin)
        .expect(400);

      expect(response.body.message).toContain('password must be a string');
    });
  });
});
