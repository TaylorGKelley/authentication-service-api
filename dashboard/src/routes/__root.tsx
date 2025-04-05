import {
  createRootRouteWithContext,
  Link,
  Outlet,
  useRouter,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import './global.css';
import AuthContextType from '../types/AuthContextType';
import useAuthContext from '../hooks/useAuthContext';

type RouterContext = {
  auth: AuthContextType | undefined;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});

function RootLayout() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthContext();

  const handleLogout = async () => {
    await logout();
    router.navigate({ to: '/' });
  };

  return (
    <main className="container mx-auto">
      <div className="flex gap-4 p-2">
        <div className="align-center flex flex-grow gap-4">
          <Link to="/" className="[&.active]:font-bold">
            Home
          </Link>
        </div>
        <div className="flex justify-center gap-4">
          {isAuthenticated ? (
            <>
              <p>
                Welcome back,{' '}
                {user?.firstName
                  ? user?.firstName + ' ' + user?.lastName
                  : user?.email}
              </p>
              <button
                onClick={handleLogout}
                className="cursor-pointer border-none bg-none p-0"
              >
                Logout
              </button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </main>
  );
}
