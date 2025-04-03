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

  const logout = () => {
    context.setIsAuthenticated(false);
    context.setAccessToken(null);
    context.setUser(null);
  };

  return {
    isAuthenticated: context.isAuthenticated,
    accessToken: context.accessToken,
    user: context.user,
    login,
    logout,
  };
};

export default useAuth;
