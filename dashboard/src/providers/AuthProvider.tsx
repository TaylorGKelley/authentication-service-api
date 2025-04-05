import {
  FC,
  PropsWithChildren,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import User from '../types/User';
import AuthContext from '../contexts/AuthContext';
import AuthContextType from '../types/AuthContextType';
import api from '../lib/api';
import useCSRFTokenContext from '../hooks/useCSRFTokenContext';
import { AxiosRequestConfig } from 'axios';

type AxiosRequestConfigWithRetry = AxiosRequestConfig & {
  _retry?: boolean;
};

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null | undefined>();
  const [user, setUser] = useState<User | null | undefined>();

  const csrfToken = useCSRFTokenContext();

  // fetch auth state and tokens
  useEffect(() => {
    const fetchAuthState = async () => {
      try {
        const response = await api.get<{
          isAuthenticated: boolean;
          user: User;
        }>('/check-auth');

        setIsAuthenticated(response.data.isAuthenticated);
        setUser(response.data.user);
      } catch {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    // Be sure the CSRF token is available before fetching auth state
    if (csrfToken) fetchAuthState();
  }, [csrfToken, accessToken]);

  // Add Access Token request interceptor to api(axios) config
  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.request.use((config) => {
      config.headers!.Authorization = !(config as AxiosRequestConfigWithRetry)
        ._retry
        ? `Bearer ${accessToken}`
        : config.headers!.Authorization;
      return config;
    });

    return () => {
      api.interceptors.request.eject(authInterceptor);
    };
  }, [accessToken]);

  // Add Refresh Token request interceptor to api(axios) config
  useLayoutEffect(() => {
    const refreshInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (!error?.response?.status || !csrfToken) {
          // If error is not a response error or CSRF token is not available, just return
          return Promise.reject(error);
        }

        const originalRequest = error.config;
        if (
          (error.response.status === 403 &&
            error.response.data.message === 'Invalid access token') ||
          (error.response.status === 401 && accessToken === undefined)
        ) {
          try {
            const response = await api.post<{ accessToken: string }>(
              '/refresh-token',
              undefined,
              {
                headers: {
                  'X-CSRF-Token': csrfToken,
                },
                withCredentials: true,
              },
            );

            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${response.data.accessToken}`,
            };
            originalRequest._retry = true;
            return api(originalRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }
      },
    );

    return () => {
      api.interceptors.response.eject(refreshInterceptor);
    };
  }, [csrfToken]);

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

export default AuthProvider;
