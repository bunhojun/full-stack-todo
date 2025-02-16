import { ChangeEvent, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createUser } from '@/apis/user/api.ts';
import { login } from '@/apis/auth/api.ts';
import { routerPaths } from '@/routes/paths.ts';
import { Navigate } from 'react-router';

export const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const { mutate: signUpMutate } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      loginMutate({
        email,
        password,
      });
    },
    onError: (error) => {
      alert(`Failed to sign up: ${error}`);
    },
  });
  const { mutate: loginMutate, isSuccess: loginSuccess } = useMutation({
    mutationFn: login,
  });
  const onClickSubmit = async () => {
    signUpMutate({
      name,
      email,
      password,
    });
  };

  if (loginSuccess) {
    return <Navigate replace to={routerPaths.home} />;
  }

  return (
    <div>
      <h1>Sign Up</h1>
      <form>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" onChange={onChangeName} />
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" onChange={onChangeEmail} />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          onChange={onChangePassword}
        />
        <button type="button" onClick={onClickSubmit}>
          Sign Up
        </button>
      </form>
    </div>
  );
};
