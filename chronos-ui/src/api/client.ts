import axios from 'axios';
import type { ApiError } from '../types/api';
import { API_BASE_URL } from '../lib/constants';
import { useAuthStore } from '../features/auth/store/authStore';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      useAuthStore.getState().clearSession();
      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }

    return Promise.reject(error);
  },
);

export const toApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error) && error.response?.data) {
    return error.response.data as ApiError;
  }

  return {
    status: 500,
    error: 'INTERNAL_ERROR',
    message: 'Unexpected error occurred',
    path: window.location.pathname,
    timestamp: new Date().toISOString(),
    details: [],
  };
};
