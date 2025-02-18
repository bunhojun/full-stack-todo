import { useQuery } from '@tanstack/react-query';
import { getHello } from '@/apis/auth/api.ts';
import { Navigate } from 'react-router';
import { routerPaths } from '@/routes/paths.ts';
import { ReactNode } from 'react';

type AuthedRouteProps = {
  children: ReactNode;
};

export const AuthedRoute = ({ children }: AuthedRouteProps) => {
  const { isPending, isError } = useQuery({
    queryKey: ['getHello'],
    queryFn: getHello,
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <Navigate replace to={routerPaths.login} />;
  }

  return children;
};
