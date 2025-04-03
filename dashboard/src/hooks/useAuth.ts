import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';
import User from '../types/User';

const useAuth = () => {
  const context = useContext(AuthContext);

  const login = ({
    accessToken,
    user,
  }: {
    accessToken: string;
    user: User;
  }) => {
    context.setIsAuthenticated(true);
    context.setAccessToken(accessToken);
    context.setUser(user);
  };

  // ! add logout

  return { ...context, login };
};

export default useAuth;
