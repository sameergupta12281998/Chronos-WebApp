import type { ExecutionResponse } from '../../../types/api';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { formatDateTime } from '../../../lib/date';

interface ExecutionListProps {
  executions: ExecutionResponse[];
  selectedExecutionId?: string;
  onSelect: (executionId: string) => void;
}

export const ExecutionList = ({
  executions,
  selectedExecutionId,
  onSelect,
}: ExecutionListProps) => {
  return (
    <div className="card">
      <h3>Executions</h3>
      <ul className="list-stack">
        {executions.map((execution) => (
          <li key={execution.id}>
            <button
              type="button"
              className={`list-item-btn ${selectedExecutionId === execution.id ? 'active' : ''}`}
              onClick={() => onSelect(execution.id)}
            >
              <div>
                <strong>Attempt {execution.attempt}</strong>
                <span>{formatDateTime(execution.startedAt)}</span>
              </div>
              <StatusBadge value={execution.status} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
