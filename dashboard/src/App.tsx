import { RouterProvider } from '@tanstack/react-router';
import useAuthContext from './hooks/useAuthContext';
import AuthProvider from './providers/AuthProvider';
import { router } from './main';
import AuthContextType from './types/AuthContextType';
import CSRFProvider from './providers/CSRFProvider';

function InnerApp() {
  const auth = useAuthContext();

  return (
    <RouterProvider
      router={router}
      context={{ auth: auth as AuthContextType | undefined }}
    />
  );
}

function App() {
  return (
    <CSRFProvider>
      <AuthProvider>
        <InnerApp />
      </AuthProvider>
    </CSRFProvider>
  );
}

export default App;
