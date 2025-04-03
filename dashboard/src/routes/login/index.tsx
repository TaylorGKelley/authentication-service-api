import { createFileRoute } from '@tanstack/react-router';
import LoginForm from '../../components/forms/LoginForm';

export const Route = createFileRoute('/login/')({
  component: RouteComponent,
  validateSearch: (search) => ({
    redirect: search.redirect as string,
  }),
});

function RouteComponent() {
  return <LoginForm />;
}
