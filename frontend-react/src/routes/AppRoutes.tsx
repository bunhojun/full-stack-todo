import { BrowserRouter, Route, Routes } from 'react-router';
import { Home } from '@/components/pages/Home/page.tsx';
import { Login } from '@/components/pages/Login/page.tsx';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};
