import { FC, PropsWithChildren, useEffect, useState } from 'react';
import User from '../types/User';
import AuthContext from './AuthContext';
import AuthContextType from '../types/AuthContextType';

const AuthContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null | undefined>();
  const [user, setUser] = useState<User | null | undefined>();

  useEffect(() => {
    // ! Check isAuthenticated route
  }, []);

  const contextValue = {
    isAuthenticated,
    setIsAuthenticated,
    accessToken,
    setAccessToken,
    user,
    setUser,
  } as AuthContextType;

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContextProvider;
