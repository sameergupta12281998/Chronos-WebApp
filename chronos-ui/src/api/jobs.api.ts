import { apiClient } from './client';
import type {
  CreateJobRequest,
  JobResponse,
  JobStatus,
  PageResponse,
  RescheduleJobRequest,
} from '../types/api';

export interface ListJobsParams {
  page?: number;
  size?: number;
  status?: JobStatus;
}

const createIdempotencyKey = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const listJobs = async (params: ListJobsParams): Promise<PageResponse<JobResponse>> => {
  const response = await apiClient.get<PageResponse<JobResponse>>('/api/v1/jobs', {
    params,
  });

  return response.data;
};

export const getJob = async (jobId: string): Promise<JobResponse> => {
  const response = await apiClient.get<JobResponse>(`/api/v1/jobs/${jobId}`);
  return response.data;
};

export const createJob = async (payload: CreateJobRequest): Promise<JobResponse> => {
  const response = await apiClient.post<JobResponse>('/api/v1/jobs', payload, {
    headers: {
      'Idempotency-Key': createIdempotencyKey(),
    },
  });

  return response.data;
};

export const cancelJob = async (jobId: string): Promise<JobResponse> => {
  const response = await apiClient.post<JobResponse>(`/api/v1/jobs/${jobId}/cancel`);
  return response.data;
};

export const rescheduleJob = async (
  jobId: string,
  payload: RescheduleJobRequest,
): Promise<JobResponse> => {
  const response = await apiClient.post<JobResponse>(`/api/v1/jobs/${jobId}/reschedule`, payload);
  return response.data;
};
