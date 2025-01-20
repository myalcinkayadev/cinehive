import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'tickets' })
export class TicketPersistence {
  @PrimaryKey()
  id!: string;

  @Property()
  userId!: string;

  @Property()
  sessionId!: string;

  @Property({ type: 'Date' })
  purchasedAt!: Date;
}
