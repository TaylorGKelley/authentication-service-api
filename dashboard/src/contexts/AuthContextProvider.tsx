import { FC, PropsWithChildren, useEffect, useState } from 'react';
import User from '../types/User';
import AuthContext from './AuthContext';
import AuthContextType from '../types/AuthContextType';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const AuthContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null | undefined>();
  const [user, setUser] = useState<User | null | undefined>();

  const { data, isSuccess } = useQuery({
    queryKey: ['checkAuth', accessToken],
    queryFn: () => checkAuth(accessToken!),
    enabled: !!accessToken,
  });

  // Sets state variables on success of query
  useEffect(() => {
    if (isSuccess) {
      // Handle successful data fetching
      setIsAuthenticated(data.isAuthenticated);
      setUser(data.user);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [isSuccess, data]);

  // Context's value
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

// Fetch /check-auth route for query client
const checkAuth = async (accessToken: string) => {
  const response = await axios.get('http://localhost:7001/api/v1/check-auth', {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data as {
    isAuthenticated: boolean;
    user: User;
  };
};

export default AuthContextProvider;
