import { Module } from '@nestjs/common';
import { MovieManagementModule } from './movie-management/movie-management.module';
import { UserManagementModule } from './user-management/user-management.module';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import ormConfig from './shared/config/orm.config';
import databaseConfig, {
  DatabaseConfig,
} from './shared/config/database.config';
import { TelemetryModule } from './shared/telemetry/telemetry';
import telemetryConfig from './shared/config/telemetry.config';
import { HealthModule } from './shared/health/health.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CqrsModule } from '@nestjs/cqrs';
import jwtConfig from './shared/config/jwt.config';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER } from '@nestjs/core';
import { OrmExceptionFilter } from './shared/filter/orm-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, telemetryConfig, jwtConfig],
    }),
    HealthModule,
    TelemetryModule,
    EventEmitterModule.forRoot(),
    CqrsModule.forRoot(),
    MikroOrmModule.forRootAsync({
      inject: [databaseConfig.KEY],
      useFactory: (config: DatabaseConfig) => ormConfig(config),
    }),
    AuthModule,
    UserManagementModule,
    MovieManagementModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: OrmExceptionFilter,
    },
  ],
})
export class AppModule {}
