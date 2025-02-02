import { CreateUserDto } from '@/users/dto/create-user.dto';
import { PickType } from '@nestjs/swagger';

export class SignInDto extends PickType(CreateUserDto, [
  'email',
  'password',
] as const) {}
