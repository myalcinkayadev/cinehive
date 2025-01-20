import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { MoviePersistence } from './movie.persistence';

@Entity({ tableName: 'sessions' })
export class SessionPersistence {
  @PrimaryKey()
  id!: string;

  @Property()
  date!: Date;

  @Property()
  // TODO: Convert to TimeType
  timeSlotStart!: string;

  @Property()
  // TODO: Convert to TimeType
  timeSlotEnd!: string;

  @Property()
  roomName!: string;

  @ManyToOne(() => MoviePersistence)
  movie!: MoviePersistence;
}
