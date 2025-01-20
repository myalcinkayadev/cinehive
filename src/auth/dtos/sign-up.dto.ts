import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, Min, IsEnum } from 'class-validator';
import { UserRole } from '../../shared/roles/user-role.enum';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The username of the user' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The password of the user' })
  password: string;

  @IsInt()
  @Min(0)
  @ApiProperty({ description: 'The age of the user' })
  age: number;

  @IsEnum(UserRole)
  @IsNotEmpty()
  @ApiProperty({
    description: 'The role of the user, either manager or customer',
    enum: [UserRole.Manager, UserRole.Customer],
  })
  role: UserRole;
}
