import { FC, PropsWithChildren, useEffect, useState } from 'react';
import CSRFContext from './CSRFContext';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import useAuth from '../hooks/useAuth';

const CSRFContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const { setAccessToken } = useAuth();
  const [csrfToken, setCsrfToken] = useState<string | undefined>();

  const { data, isSuccess } = useQuery({
    queryKey: ['csrfToken'],
    queryFn: async () => {
      const response = await axios.get(
        'http://localhost:7001/api/v1/csrf-token',
        { withCredentials: true },
      );

      return response.data as { csrfToken: string };
    },
    retry: false,
  });

  useEffect(() => {
    if (isSuccess) {
      setCsrfToken(data?.csrfToken);
    }
  }, [isSuccess, data]);

  const { data: dataRefresh, isSuccess: isSuccessRefresh } = useQuery({
    queryKey: ['refreshToken', csrfToken],
    queryFn: async () => {
      const response = await axios.post(
        'http://localhost:7001/api/v1/refresh-token',
        null,
        {
          headers: {
            'X-CSRF-Token': csrfToken,
          },
          withCredentials: true,
        },
      );

      return response.data as { accessToken: string };
    },
    enabled: !!csrfToken,
    retry: false,
  });

  useEffect(() => {
    if (isSuccessRefresh) {
      setAccessToken(dataRefresh!.accessToken);
    } else {
      setAccessToken(null);
    }
  }, [isSuccessRefresh, dataRefresh]);

  return (
    <CSRFContext.Provider value={csrfToken}>{children}</CSRFContext.Provider>
  );
};

export default CSRFContextProvider;
