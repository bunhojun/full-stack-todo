import { UserContext } from '@/contexts/UserContext.ts';
import { useContext } from 'react';
import { useMutation } from '@tanstack/react-query';
import { logout } from '@/apis/auth/api.ts';
import { Navigate } from 'react-router';
import { routerPaths } from '@/routes/paths.ts';

export const UserPage = () => {
  const user = useContext(UserContext);
  const { mutate: logoutMutate, isSuccess: logoutSuccess } = useMutation({
    mutationFn: () => logout(),
  });

  const onClickLogout = async () => {
    logoutMutate();
  };

  if (!user) {
    return null;
  }

  if (logoutSuccess) {
    return <Navigate replace to={`/${routerPaths.login}`} />;
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <h2>email</h2>
      <p>{user.email}</p>
      <div>
        <button onClick={onClickLogout}>Log Out</button>
      </div>
    </div>
  );
};
