import { createFileRoute, useSearch } from '@tanstack/react-router';
import useAuth from '../../../hooks/useAuth';

export const Route = createFileRoute('/login/google/callback')({
  component: RouteComponent,
  validateSearch: (search) => ({
    accessToken: search.at as string | undefined,
  }),
});

function RouteComponent() {
  const auth = useAuth();
  const { accessToken } = useSearch({ from: '/login/google/callback' });

  if (accessToken) {
    auth.setAccessToken(accessToken!);
  }

  return (
    <main>
      <p>Set access token/login user</p>
    </main>
  );
}
