import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import './global.css';
import AuthContextType from '../types/AuthContextType';

type RouterContext = {
  auth: AuthContextType | undefined;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <main className="container mx-auto">
      <div className="flex gap-4 p-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/register" className="[&.active]:font-bold">
          Register
        </Link>
        <Link
          to="/login"
          search={{ redirect: '/' }}
          className="[&.active]:font-bold"
        >
          Login
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </main>
  ),
});
