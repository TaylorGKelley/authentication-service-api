import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useRefreshToken = (csrfToken: string | undefined) => {
  return useQuery({
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
  });
};
