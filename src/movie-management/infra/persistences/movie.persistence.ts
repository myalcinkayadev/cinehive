import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { SessionPersistence } from './session.persistence';

@Entity({ tableName: 'movies' })
export class MoviePersistence {
  @PrimaryKey()
  id!: string;

  @Property()
  name!: string;

  @Property()
  ageRestriction!: number;

  @OneToMany(() => SessionPersistence, (session) => session.movie)
  sessions = new Collection<SessionPersistence>(this);
}
