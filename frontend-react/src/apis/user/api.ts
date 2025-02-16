import { fetcher } from '@/apis/fetcher.ts';
import { CreateUserDto, UserWithoutPassword } from '@/types/user.type.ts';

export const createUser = async (createUserDto: CreateUserDto) => {
  return fetcher<UserWithoutPassword>('/users', {
    method: 'POST',
    body: new URLSearchParams({
      ...createUserDto,
      role: 'normal',
    }),
  });
};
