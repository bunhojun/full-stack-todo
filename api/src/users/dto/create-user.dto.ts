import { IsEmail, IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { UserRole } from '@/users/types/user-role.type';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsIn(Object.values(UserRole))
  role?: UserRole;
}
