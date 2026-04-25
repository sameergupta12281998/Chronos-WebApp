import { apiClient } from './client';

export interface HealthResponse {
  status: 'UP' | 'DOWN' | 'UNKNOWN';
}

export const getGatewayHealth = async (): Promise<HealthResponse> => {
  const response = await apiClient.get<HealthResponse>('/actuator/health');
  return response.data;
};
