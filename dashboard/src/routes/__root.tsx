import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import './global.css';

export const Route = createRootRoute({
  component: () => (
    <main className="container mx-auto">
      <div className="flex gap-4 p-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/forgot-password" className="[&.active]:font-bold">
          Forgot my password
        </Link>
        <Link to="/register" className="[&.active]:font-bold">
          Register
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </main>
  ),
});
