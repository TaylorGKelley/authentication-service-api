import { createFileRoute } from '@tanstack/react-router';
import ForgotPasswordResetForm from '../../components/forms/ForgotPasswordResetForm';

export const Route = createFileRoute('/forgot-password/reset')({
  component: RouteComponent,
  validateSearch: (search) => ({
    resetToken: search.resetToken as string | undefined,
  }),
});

function RouteComponent() {
  return <ForgotPasswordResetForm />;
}
