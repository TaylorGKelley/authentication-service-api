import { createFileRoute } from '@tanstack/react-router';
import useAuthContext from '../hooks/useAuthContext';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const auth = useAuthContext();
  return (
    <div className="p-2">
      <h3>
        {!auth.isAuthenticated
          ? 'Welcome Home!'
          : `Welcome back, ${auth.user?.firstName ? auth.user?.firstName + ' ' + auth.user?.lastName : auth.user?.email}`}
      </h3>
    </div>
  );
}
