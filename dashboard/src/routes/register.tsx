import { createFileRoute } from '@tanstack/react-router';
import RegisterForm from '../components/forms/RegisterForm';

export const Route = createFileRoute('/register')({
  component: RouteComponent,
});

function RouteComponent() {
  return <RegisterForm />;
}
