import { fetcher } from '@/apis/fetcher.ts';
import { UserWithoutPassword } from '@/types/user.type.ts';

export const LOGIN_PATH = '/auth/login';

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const res = await fetcher<UserWithoutPassword>(LOGIN_PATH, {
    method: 'POST',
    body: new URLSearchParams({ email, password }),
  });

  if (!res) {
    throw new Error('Login failed');
  }

  return res;
};

export const getHello = async () => {
  const res = await fetcher<string>('/');

  if (!res) {
    throw new Error('Failed to get hello');
  }

  return res;
};

export const getAuthedUser = async () => {
  const res = await fetcher<UserWithoutPassword>('/auth');

  if (!res) {
    throw new Error('Failed to get authed user');
  }

  return res;
};

export const logout = async () => {
  return fetcher('/auth/logout', {
    method: 'POST',
  });
};
