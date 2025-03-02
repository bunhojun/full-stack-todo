import { BrowserRouter, Route, Routes } from 'react-router';
import { Home } from '@/components/pages/Home/page.tsx';
import { Login } from '@/components/pages/Login/page.tsx';
import { routerPaths } from '@/routes/paths.ts';
import { SignUp } from '@/components/pages/Signup/page.tsx';
import { AuthedRoute } from '@/routes/AuthedRoute.tsx';
import { UserPage } from '@/components/pages/User/page.tsx';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={routerPaths.home}
          element={
            <AuthedRoute>
              <Home />
            </AuthedRoute>
          }
        />
        <Route
          path={routerPaths.user}
          element={
            <AuthedRoute>
              <UserPage />
            </AuthedRoute>
          }
        />
        <Route path={routerPaths.login} element={<Login />} />
        <Route path={routerPaths.signup} element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
};
