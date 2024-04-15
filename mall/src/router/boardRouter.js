import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Loading = <div>Loading....</div>;
const BoardList = lazy(() => import('../pages/board/ListPage'));
const BoardRead = lazy(() => import('../pages/board/ReadPage'));
const BoardAdd = lazy(() => import('../pages/board/AddPage'));
const BoardModify = lazy(() => import('../pages/board/ModifyPage'));
const boardRouter = () => {
  return [
    {
      path: 'list',
      element: (
        <Suspense fallback={Loading}>
          <BoardList />
        </Suspense>
      ),
    },
    {
      path: '',
      element: <Navigate replace to="list" />,
    },
    {
      path: 'read/:bno',
      element: (
        <Suspense fallback={Loading}>
          <BoardRead />
        </Suspense>
      ),
    },
    {
      path: 'add',
      element: (
        <Suspense fallback={Loading}>
          <BoardAdd />
        </Suspense>
      ),
    },
    {
      path: 'modify/:bno',
      element: (
        <Suspense fallback={Loading}>
          <BoardModify />
        </Suspense>
      ),
    },
  ];
};

export default boardRouter;
