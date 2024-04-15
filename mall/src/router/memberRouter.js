import { lazy, Suspense } from 'react';

const Loading = <div>Loading.....</div>;
const Login = lazy(() => import('../pages/member/LoginPage'));
const LogoutPage = lazy(() => import('../pages/member/LogoutPage'));
const RegisterPage = lazy(() => import('../pages/member/RegisterPage'));

const memberRouter = () => {
  return [
    {
      path: 'login',
      element: (
        <Suspense fallback={Loading}>
          <Login />
        </Suspense>
      ),
    },
    {
      path: 'logout',
      element: (
        <Suspense fallback={Loading}>
          <LogoutPage />
        </Suspense>
      ),
    },
    {
      path: 'register',
      element: (
        <Suspense fallback={Loading}>
          <RegisterPage />
        </Suspense>
      ),
    },
  ];
};

export default memberRouter;
