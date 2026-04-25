export type ScheduleType = 'ONE_TIME' | 'RECURRING';

export type RecurrenceFrequency =
  | 'MINUTE'
  | 'HOURLY'
  | 'DAILY'
  | 'WEEKLY'
  | 'MONTHLY';

export type JobStatus =
  | 'SCHEDULED'
  | 'EXECUTING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export type ExecutionStatus =
  | 'STARTED'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'RETRY_SCHEDULED'
  | 'TERMINAL_FAILURE';

export type TaskType = 'EMAIL' | 'WEBHOOK';

export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
}

export interface ApiError {
  status: number;
  error: string;
  message: string;
  path: string;
  timestamp: string;
  correlationId?: string;
  details?: string[];
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  createdAt: string | number;
}

export interface AuthTokenResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresInSeconds: number;
  userId: string;
  username: string;
}

export interface CreateJobRequest {
  name: string;
  description?: string;
  taskType: TaskType;
  payload: string;
  scheduleType: ScheduleType;
  recurrenceFrequency?: RecurrenceFrequency;
  scheduledAt: string;
  maxAttempts: number;
}

export interface RescheduleJobRequest {
  newScheduledAt: string;
}

export interface JobResponse {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  taskType: TaskType;
  payload: string;
  scheduleType: ScheduleType;
  recurrenceFrequency: RecurrenceFrequency | null;
  scheduledAt: string | number;
  status: JobStatus;
  maxAttempts: number;
  createdAt: string | number;
  updatedAt: string | number;
}

export interface ExecutionResponse {
  id: string;
  jobId: string;
  ownerId: string;
  taskType: TaskType;
  attempt: number;
  maxAttempts: number;
  status: ExecutionStatus;
  error: string | null;
  startedAt: string | number;
  finishedAt: string | number | null;
  nextAttemptAt: string | number | null;
  correlationId: string;
}

export interface NotificationResponse {
  id: string;
  jobId: string;
  type: string;
  message: string;
  createdAt: string | number;
  dispatchedAt: string | number | null;
}
