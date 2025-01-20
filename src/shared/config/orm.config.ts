import { DatabaseConfig } from './database.config';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';

const dbDrivers = { postgres: PostgreSqlDriver };

const ormConfig = (dbConfig: DatabaseConfig): MikroOrmModuleOptions => ({
  dbName: dbConfig.name,
  entities: ['./dist/**/infra/persistences/*.persistence.js'],
  entitiesTs: ['./src/**/infra/persistences/*.persistence.ts'],
  user: dbConfig.username,
  password: dbConfig.password,
  driver: dbDrivers[dbConfig.type],
  extensions: [Migrator],
  migrations: {
    path: './migrations',
    pathTs: './migrations',
    tableName: 'cinehive_migrations',
    transactional: true,
    emit: 'ts',
  },
});

export default ormConfig;
