import { Migration } from '@mikro-orm/migrations';

export class Migration20250119214332 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "movies" ("id" varchar(255) not null, "name" varchar(255) not null, "age_restriction" int not null, constraint "movies_pkey" primary key ("id"));`);

    this.addSql(`create table "sessions" ("id" varchar(255) not null, "date" timestamptz not null, "time_slot_start" varchar(255) not null, "time_slot_end" varchar(255) not null, "room_name" varchar(255) not null, "movie_id" varchar(255) not null, constraint "sessions_pkey" primary key ("id"));`);

    this.addSql(`create table "tickets" ("id" varchar(255) not null, "user_id" varchar(255) not null, "session_id" varchar(255) not null, "purchased_at" timestamptz not null, constraint "tickets_pkey" primary key ("id"));`);

    this.addSql(`create table "users" ("id" varchar(255) not null, "username" varchar(255) not null, "password" varchar(255) not null, "age" int not null, "role" text check ("role" in ('customer', 'manager')) not null, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz null, constraint "users_pkey" primary key ("id"));`);
    this.addSql(`alter table "users" add constraint "users_username_unique" unique ("username");`);

    this.addSql(`create table "watched_movies" ("id" varchar(255) not null, "user_id" varchar(255) not null, "movie_id" varchar(255) not null, "ticket_id" varchar(255) not null, "watched_at" timestamptz not null, constraint "watched_movies_pkey" primary key ("id"));`);

    this.addSql(`alter table "sessions" add constraint "sessions_movie_id_foreign" foreign key ("movie_id") references "movies" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "sessions" drop constraint "sessions_movie_id_foreign";`);

    this.addSql(`drop table if exists "movies" cascade;`);

    this.addSql(`drop table if exists "sessions" cascade;`);

    this.addSql(`drop table if exists "tickets" cascade;`);

    this.addSql(`drop table if exists "users" cascade;`);

    this.addSql(`drop table if exists "watched_movies" cascade;`);
  }

}
