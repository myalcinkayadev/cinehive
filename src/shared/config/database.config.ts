import { registerAs } from '@nestjs/config';

export type DatabaseConfig = {
  host: string;
  port: number;
  name: string;
  type: string;
  username: string;
  password: string;
};

export default registerAs(
  'database',
  (): DatabaseConfig => ({
    host: process.env.DB_HOST,
    port: +process.env.PORT || 5432,
    name: process.env.DB_NAME,
    type: process.env.DB_TYPE,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  }),
);
