import { useContext } from 'react';
import { UserContext } from '@/contexts/UserContext.ts';
import { Link } from 'react-router';
import { routerPaths } from '@/routes/paths.ts';

export const Home = () => {
  const user = useContext(UserContext);

  if (!user) {
    return null;
  }

  return (
    <div>
      <h1>
        <Link to={routerPaths.user}>{user.name}</Link>'s Home Page
      </h1>
    </div>
  );
};
