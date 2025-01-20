import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordHashingService {
  async hash(password: string): Promise<string> {
    const rounds = 12;
    const salt = await bcrypt.genSalt(rounds);
    return bcrypt.hash(password, salt);
  }

  compare(rawPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(rawPassword, hashedPassword);
  }
}
