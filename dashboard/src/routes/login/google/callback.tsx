import { createFileRoute, useSearch } from '@tanstack/react-router';

export const Route = createFileRoute('/login/google/callback')({
  component: RouteComponent,
  validateSearch: (search) => ({
    accessToken: search.at as string | undefined,
  }),
});

function RouteComponent() {
  const { accessToken } = useSearch({ from: '/login/google/callback' });
  console.log(accessToken);

  return (
    <main>
      <p>Set access token/login user</p>
    </main>
  );
}
