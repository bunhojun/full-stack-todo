import { useQuery } from '@tanstack/react-query';
import { getAuthedUser } from '@/apis/auth/api.ts';
import { Navigate } from 'react-router';
import { routerPaths } from '@/routes/paths.ts';
import { ReactNode } from 'react';
import { UserContext } from '@/contexts/UserContext.ts';

type AuthedRouteProps = {
  children: ReactNode;
};

export const AuthedRoute = ({ children }: AuthedRouteProps) => {
  const {
    isPending,
    isError,
    data: user,
  } = useQuery({
    queryKey: ['getAuthedUser'],
    queryFn: getAuthedUser,
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <Navigate replace to={routerPaths.login} />;
  }

  return <UserContext value={user}>{children}</UserContext>;
};
