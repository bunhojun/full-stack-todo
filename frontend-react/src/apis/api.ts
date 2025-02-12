import { fetcher } from '@/apis/fetcher.ts';

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  await fetcher('/auth/login', {
    method: 'POST',
    body: new URLSearchParams({ email, password }),
  });
};
