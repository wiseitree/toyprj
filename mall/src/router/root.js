import { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import todoRouter from './todoRouter';
import memberRouter from './memberRouter';
import boardRouter from './boardRouter';

const Loading = <div>Loading....</div>;
const Main = lazy(() => import('../pages/MainPage'));
const About = lazy(() => import('../pages/AboutPage'));

const TodoIndex = lazy(() => import('../pages/todo/IndexPage'));
const TodoList = lazy(() => import('../pages/todo/ListPage'));

const BoardIndex = lazy(() => import('../pages/board/IndexPage'));

const root = createBrowserRouter([
  {
    path: '',
    element: (
      <Suspense fallback={Loading}>
        <Main />
      </Suspense>
    ),
  },
  {
    path: 'about',
    element: (
      <Suspense fallback={Loading}>
        <About />
      </Suspense>
    ),
  },
  {
    path: 'todo',
    element: (
      <Suspense fallback={Loading}>
        <TodoIndex />
      </Suspense>
    ),
    children: todoRouter(),
  },
  {
    path: 'board',
    element: (
      <Suspense fallback={Loading}>
        <BoardIndex />
      </Suspense>
    ),
    children: boardRouter(),
  },
  {
    path: 'member',
    children: memberRouter(),
  },
]);

export default root;
