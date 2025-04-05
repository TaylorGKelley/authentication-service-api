import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';
import User from '../types/User';

const useAuthContext = () => {
  const authContext = useContext(AuthContext);

  const login = ({
    accessToken,
    user,
  }: {
    accessToken: string;
    user: User;
  }) => {
    authContext.setIsAuthenticated(true);
    authContext.setAccessToken(accessToken);
    authContext.setUser(user);
  };

  const logout = () => {
    authContext.setIsAuthenticated(false);
    authContext.setAccessToken(null);
    authContext.setUser(null);
  };

  return {
    ...authContext,
    login,
    logout,
  };
};

export default useAuthContext;
