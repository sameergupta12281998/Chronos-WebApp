import { apiClient } from './client';
import type { AuthTokenResponse, UserResponse } from '../types/api';

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export const registerUser = async (payload: RegisterRequest): Promise<UserResponse> => {
  const response = await apiClient.post<UserResponse>('/api/v1/auth/register', payload);
  return response.data;
};

export const loginUser = async (payload: LoginRequest): Promise<AuthTokenResponse> => {
  const response = await apiClient.post<AuthTokenResponse>('/api/v1/auth/login', payload);
  return response.data;
};
