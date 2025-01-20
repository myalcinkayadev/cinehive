import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'watched_movies' })
export class WatchedMoviePersistence {
  @PrimaryKey()
  id!: string;

  @Property()
  userId!: string;

  @Property()
  movieId!: string;

  @Property()
  ticketId!: string;

  @Property({ type: 'Date' })
  watchedAt!: Date;
}
