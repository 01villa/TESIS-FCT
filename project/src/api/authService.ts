import { axiosInstance } from './axios.config';
import type { LoginCredentials, User, AuthTokens } from '../types/auth.types';
import type { ApiResponse } from '../types/api.types';

interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await axiosInstance.post<ApiResponse<LoginResponse>>(
      '/auth/login',
      credentials
    );
    return response.data.data;
  },

  register: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<LoginResponse> => {
    const response = await axiosInstance.post<ApiResponse<LoginResponse>>(
      '/auth/register',
      data
    );
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await axiosInstance.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  },

  refreshToken: async (refreshToken: string): Promise<AuthTokens> => {
    const response = await axiosInstance.post<ApiResponse<AuthTokens>>(
      '/auth/refresh',
      { refreshToken }
    );
    return response.data.data;
  },
};
