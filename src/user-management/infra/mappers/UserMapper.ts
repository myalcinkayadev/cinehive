import { User } from '../../../user-management/domain/user.entity';
import { UserPersistence } from '../persistences/user.persistence';

export class UserMapper {
  static toDomain(persistence: UserPersistence): User {
    return new User(
      persistence.id,
      persistence.username,
      persistence.password,
      persistence.age,
      persistence.role,
    );
  }

  static toPersistence(domain: User): UserPersistence {
    const persistence = new UserPersistence();
    persistence.id = domain.id;
    persistence.username = domain.username;
    persistence.password = domain.password;
    persistence.age = domain.age;
    persistence.role = domain.role;
    return persistence;
  }
}
