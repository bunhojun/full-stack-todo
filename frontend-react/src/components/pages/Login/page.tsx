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

  const { mutate, isSuccess: isLoginSuccess } = useMutation({
    mutationFn: login,
  });

  const onClickSubmit = () => {
    mutate({
      email,
      password,
    });
  };

  if (isLoginSuccess) {
    return <Navigate replace to={routerPaths.home} />;
  }

  return (
    <div>
      <h1>Login</h1>
      <form>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={onChangeEmail}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={onChangePassword}
        />
        <button type="button" onClick={onClickSubmit}>
          Submit
        </button>
      </form>
      need an account? <Link to={`/${routerPaths.signup}`}>Sign up</Link>
    </div>
  );
};
