import { MikroORM } from '@mikro-orm/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import * as request from 'supertest';

export class TestSetup {
  private appInstance: INestApplication;
  private ormInstance: MikroORM;
  private initialized = false;

  async init() {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.appInstance = moduleRef.createNestApplication();
    this.appInstance.useGlobalPipes(new ValidationPipe());
    await this.appInstance.init();

    this.ormInstance = moduleRef.get<MikroORM>(MikroORM);

    // Reset the database schema
    await this.ormInstance.getSchemaGenerator().dropSchema();
    await this.ormInstance.getSchemaGenerator().createSchema();

    this.initialized = true;
  }

  get app(): INestApplication {
    if (!this.appInstance) {
      throw new Error(
        'Application instance is not initialized. Call init() first.',
      );
    }
    return this.appInstance;
  }

  get orm(): MikroORM {
    if (!this.ormInstance) {
      throw new Error('ORM instance is not initialized. Call init() first.');
    }
    return this.ormInstance;
  }

  get request() {
    if (!this.initialized) {
      throw new Error('TestSetup is not initialized. Call init() first.');
    }
    return request(this.appInstance.getHttpServer());
  }

  async clearDatabase() {
    await this.ormInstance.getSchemaGenerator().clearDatabase();
  }

  async teardown() {
    if (!this.initialized) return;

    if (this.ormInstance) {
      await this.ormInstance.close();
    }

    if (this.appInstance) {
      await this.appInstance.close();
    }

    this.initialized = false;
  }
}
