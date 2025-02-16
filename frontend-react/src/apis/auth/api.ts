import { fetcher } from '@/apis/fetcher.ts';
import { UserWithoutPassword } from '@/types/user.type.ts';

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const res = await fetcher<UserWithoutPassword>('/auth/login', {
    method: 'POST',
    body: new URLSearchParams({ email, password }),
  });

  if (!res) {
    throw new Error('Login failed');
  }

  return res;
};
