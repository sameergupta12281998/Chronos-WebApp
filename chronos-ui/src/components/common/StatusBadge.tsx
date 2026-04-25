interface StatusBadgeProps {
  value: string;
}

const statusClass = (value: string) => {
  if (['SUCCEEDED', 'COMPLETED', 'UP'].includes(value)) {
    return 'status-success';
  }

  if (['FAILED', 'TERMINAL_FAILURE', 'DOWN', 'CANCELLED'].includes(value)) {
    return 'status-danger';
  }

  if (['EXECUTING', 'STARTED', 'RETRY_SCHEDULED', 'SCHEDULED'].includes(value)) {
    return 'status-warn';
  }

  return 'status-muted';
};

export const StatusBadge = ({ value }: StatusBadgeProps) => (
  <span className={`status-badge ${statusClass(value)}`}>{value}</span>
);
