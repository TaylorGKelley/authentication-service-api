import { RouterProvider } from '@tanstack/react-router';
import useAuth from './hooks/useAuth';
import AuthContextProvider from './contexts/AuthContextProvider';
import { router } from './main';

function InnerApp() {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ auth }} />;
}

function App() {
  return (
    <AuthContextProvider>
      <InnerApp />
    </AuthContextProvider>
  );
}

export default App;
