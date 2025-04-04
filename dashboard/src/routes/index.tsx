import { createFileRoute } from '@tanstack/react-router';
import useAuth from '../hooks/useAuth';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const auth = useAuth();
  return (
    <div className="p-2">
      <h3>
        {!auth.isAuthenticated
          ? 'Welcome Home!'
          : `Welcome back, ${auth.user?.email}`}
      </h3>
    </div>
  );
}
