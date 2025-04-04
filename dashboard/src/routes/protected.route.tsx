import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/protected')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth?.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div>You are authenticated!</div>;
}
