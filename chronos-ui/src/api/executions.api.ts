import { apiClient } from './client';
import type { ExecutionResponse } from '../types/api';

export const listExecutionsByJob = async (jobId: string): Promise<{ items: ExecutionResponse[] }> => {
  const response = await apiClient.get<{ items: ExecutionResponse[] }>(`/api/v1/jobs/${jobId}/executions`);
  return response.data;
};

export const getExecution = async (executionId: string): Promise<ExecutionResponse> => {
  const response = await apiClient.get<ExecutionResponse>(`/api/v1/executions/${executionId}`);
  return response.data;
};
