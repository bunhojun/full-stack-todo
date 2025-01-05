import { IsEmail, IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { UserRole } from '@/users/types/user-role.type';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'test name',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'test@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'normal',
  })
  @IsOptional()
  @IsIn(Object.values(UserRole))
  role?: UserRole;
}
