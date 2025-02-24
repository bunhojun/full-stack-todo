import { useContext } from 'react';
import { UserContext } from '@/contexts/UserContext.ts';

// use under AuthedRoute component
export const useAuth = () => {
  const user = useContext(UserContext);

  // user is always defined under AuthedRoute
  if (!user) {
    throw new Error('User is not authenticated');
  }

  return { user };
};
