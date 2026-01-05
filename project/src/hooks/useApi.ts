import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';
import type { ApiError } from '../types/api.types';

interface UseApiState<T> {
  data: T | null;
  error: ApiError | null;
  isLoading: boolean;
}

export const useApi = <T,>() => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    setState({ data: null, error: null, isLoading: true });

    try {
      const data = await apiCall();
      setState({ data, error: null, isLoading: false });
      return data;
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const apiError: ApiError = {
        message: error.response?.data?.message || 'An error occurred',
        statusCode: error.response?.status || 500,
        errors: error.response?.data?.errors,
      };
      setState({ data: null, error: apiError, isLoading: false });
      throw apiError;
    }
  }, []);

  return { ...state, execute };
};
