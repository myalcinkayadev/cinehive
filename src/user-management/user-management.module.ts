import { Module } from '@nestjs/common';
import { UserController } from './infra/controllers/user.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { OrmUserRepository } from './infra/repositories/user.repository';
import { USER_REPOSITORY } from './domain/user.repository';
import { UserPersistence } from './infra/persistences/user.persistence';
import { GetUserHandler } from './application/handlers/get-user.handler';
import { UserService } from './application/services/user.service';
import { PasswordHashingService } from './application/services/password-hashing.service';
import { WatchHistoryService } from './application/services/watch-history.service';

@Module({
  imports: [MikroOrmModule.forFeature([UserPersistence])],
  controllers: [UserController],
  providers: [
    PasswordHashingService,
    { provide: USER_REPOSITORY, useClass: OrmUserRepository },
    GetUserHandler,
    UserService,
    WatchHistoryService,
  ],
  exports: [UserService],
})
export class UserManagementModule {}
