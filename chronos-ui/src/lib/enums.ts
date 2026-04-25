import type { ExecutionStatus, JobStatus } from '../types/api';

export const TERMINAL_JOB_STATUSES: JobStatus[] = [
  'COMPLETED',
  'FAILED',
  'CANCELLED',
];

export const ACTIVE_JOB_STATUSES: JobStatus[] = ['SCHEDULED', 'EXECUTING'];

export const TERMINAL_EXECUTION_STATUSES: ExecutionStatus[] = [
  'SUCCEEDED',
  'FAILED',
  'TERMINAL_FAILURE',
];
