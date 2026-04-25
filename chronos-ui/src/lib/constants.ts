export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? '';

export const QUERY_KEYS = {
  jobs: 'jobs',
  job: 'job',
  executions: 'executions',
  execution: 'execution',
  notifications: 'notifications',
  notification: 'notification',
  health: 'health',
} as const;
