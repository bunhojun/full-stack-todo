import { User } from '@/users/entities/user.entity';

export type UserWithoutPasswordType = Omit<User, 'password'>;
