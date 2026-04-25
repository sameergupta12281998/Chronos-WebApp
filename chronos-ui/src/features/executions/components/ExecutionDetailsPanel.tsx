import type { ExecutionResponse } from '../../../types/api';
import { formatDateTime } from '../../../lib/date';

interface ExecutionDetailsPanelProps {
  execution?: ExecutionResponse;
}

export const ExecutionDetailsPanel = ({ execution }: ExecutionDetailsPanelProps) => {
  if (!execution) {
    return (
      <div className="card">
        <h3>Execution Details</h3>
        <p>Select an execution record to inspect details.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3>Execution Details</h3>
      <dl className="details-grid">
        <dt>ID</dt>
        <dd>{execution.id}</dd>
        <dt>Status</dt>
        <dd>{execution.status}</dd>
        <dt>Task Type</dt>
        <dd>{execution.taskType}</dd>
        <dt>Attempt</dt>
        <dd>
          {execution.attempt} / {execution.maxAttempts}
        </dd>
        <dt>Started</dt>
        <dd>{formatDateTime(execution.startedAt)}</dd>
        <dt>Finished</dt>
        <dd>{formatDateTime(execution.finishedAt)}</dd>
        <dt>Error</dt>
        <dd>{execution.error ?? '-'}</dd>
        <dt>Correlation</dt>
        <dd>{execution.correlationId}</dd>
      </dl>
    </div>
  );
};
