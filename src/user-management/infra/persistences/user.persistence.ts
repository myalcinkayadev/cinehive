import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import { UserRole } from '../../../shared/roles/user-role.enum';

@Entity({ tableName: 'users' })
export class UserPersistence {
  @PrimaryKey()
  id!: string;

  @Property({ unique: true })
  username!: string;

  @Property()
  password!: string;

  @Property()
  age!: number;

  @Enum(() => UserRole)
  role!: UserRole;

  @Property({ type: 'Date', defaultRaw: 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Property({
    type: 'Date',
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
    nullable: true,
  })
  updatedAt?: Date;
}
