import { UserRole } from '../../shared/roles/user-role.enum';

export class User {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly password: string,
    public readonly age: number,
    public readonly role: UserRole,
  ) {
    if (age < 0) {
      throw new Error('Age must be greater or equal to zero.');
    }

    if (!username || username.trim().length < 3) {
      throw new Error('Username must be at least 3 characters long.');
    }
  }
}
