import { Link } from 'react-router-dom';
import type { JobResponse } from '../../../types/api';
import { formatDateTime } from '../../../lib/date';
import { StatusBadge } from '../../../components/common/StatusBadge';

interface JobListTableProps {
  jobs: JobResponse[];
  onCancel: (jobId: string) => void;
}

export const JobListTable = ({ jobs, onCancel }: JobListTableProps) => {
  return (
    <div className="card table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Task</th>
            <th>Schedule</th>
            <th>Scheduled At</th>
            <th>Status</th>
            <th>Attempts</th>
            <th>Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td>{job.name}</td>
              <td>{job.taskType}</td>
              <td>{job.scheduleType}</td>
              <td>{formatDateTime(job.scheduledAt)}</td>
              <td>
                <StatusBadge value={job.status} />
              </td>
              <td>{job.maxAttempts}</td>
              <td>{formatDateTime(job.updatedAt)}</td>
              <td className="actions-cell">
                <Link to={`/jobs/${job.id}`}>Open</Link>
                {['SCHEDULED', 'EXECUTING'].includes(job.status) ? (
                  <button type="button" onClick={() => onCancel(job.id)}>
                    Cancel
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
