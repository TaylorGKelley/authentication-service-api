import { RouterProvider } from '@tanstack/react-router';
import useAuth from './hooks/useAuth';
import AuthContextProvider from './contexts/AuthContextProvider';
import { router } from './main';
import AuthContextType from './types/AuthContextType';
import CSRFContextProvider from './contexts/CSRFContextProvider';

function InnerApp() {
  const auth = useAuth();

  return (
    <RouterProvider
      router={router}
      context={{ auth: auth as AuthContextType | undefined }}
    />
  );
}

function App() {
  return (
    <AuthContextProvider>
      <CSRFContextProvider>
        <InnerApp />
      </CSRFContextProvider>
    </AuthContextProvider>
  );
}

export default App;
