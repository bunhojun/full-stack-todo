import { ChangeEvent, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { login } from '@/apis/auth/api.ts';
import { Link, Navigate } from 'react-router';
import { routerPaths } from '@/routes/paths.ts';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const {
    mutate,
    isSuccess: isLoginSuccess,
    isPending,
  } = useMutation({
    mutationFn: login,
  });

  const onClickSubmit = () => {
    mutate({
      email,
      password,
    });
  };

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isLoginSuccess) {
    return <Navigate replace to={routerPaths.home} />;
  }

  return (
    <div>
      <h1>Login</h1>
      <form>
        <label htmlFor="email">Email</label>
        <input
          data-testid="email"
          type="email"
          placeholder="email"
          value={email}
          onChange={onChangeEmail}
        />
        <label htmlFor="password">Password</label>
        <input
          data-testid="password"
          type="password"
          placeholder="password"
          value={password}
          onChange={onChangePassword}
        />
        <button data-testid="submit" type="button" onClick={onClickSubmit}>
          Submit
        </button>
      </form>
      need an account? <Link to={`/${routerPaths.signup}`}>Sign up</Link>
    </div>
  );
};
