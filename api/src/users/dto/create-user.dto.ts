import { IsEmail, IsNotEmpty } from 'class-validator';
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
}
