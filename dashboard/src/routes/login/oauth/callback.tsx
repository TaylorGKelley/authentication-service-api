import { createFileRoute, useRouter, useSearch } from '@tanstack/react-router';
import useAuthContext from '../../../hooks/useAuthContext';
import { useEffect } from 'react';

export const Route = createFileRoute('/login/oauth/callback')({
  component: RouteComponent,
  validateSearch: (search) => ({
    accessToken: search.at as string | undefined,
  }),
});

function RouteComponent() {
  const router = useRouter();
  const { setAccessToken } = useAuthContext();
  const { accessToken } = useSearch({ from: '/login/oauth/callback' });

  useEffect(() => {
    if (accessToken) {
      setAccessToken(accessToken!);
    }
    router.navigate({ to: '/' });
  }, [accessToken, setAccessToken]);

  return (
    <main>
      <p>Set access token/login user</p>
    </main>
  );
}
