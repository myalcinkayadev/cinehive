import { Entity } from '../../shared/domain/entitiy';
import { UserRole } from '../../shared/roles/user-role.enum';
import { AggregateRoot } from '../../shared/domain/aggregate-root';

export class User extends Entity implements AggregateRoot {
  constructor(
    id: string,
    public readonly username: string,
    public readonly password: string,
    public readonly age: number,
    public readonly role: UserRole,
  ) {
    super(id);
    if (age < 0) {
      throw new Error('Age must be greater or equal to zero.');
    }

    if (!username || username.trim().length < 3) {
      throw new Error('Username must be at least 3 characters long.');
    }
  }
}
