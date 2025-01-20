import { registerAs } from '@nestjs/config';

export type JwtConfig = {
  secret: string;
  signOptions: { expiresIn: string };
};

export default registerAs(
  'jwt',
  (): JwtConfig => ({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '10m' },
  }),
);
