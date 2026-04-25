import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { cancelJob, getJob, rescheduleJob } from '../../../api/jobs.api';
import { getExecution, listExecutionsByJob } from '../../../api/executions.api';
import { QUERY_KEYS } from '../../../lib/constants';
import { formatDateTime } from '../../../lib/date';
import { ExecutionList } from '../../executions/components/ExecutionList';
import { ExecutionDetailsPanel } from '../../executions/components/ExecutionDetailsPanel';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { RescheduleModal } from '../components/RescheduleModal';

export const JobDetailsPage = () => {
  const { jobId = '' } = useParams();
  const queryClient = useQueryClient();
  const [selectedExecutionId, setSelectedExecutionId] = useState<string | undefined>();
  const [rescheduleOpen, setRescheduleOpen] = useState(false);

  const jobQuery = useQuery({
    queryKey: [QUERY_KEYS.job, jobId],
    queryFn: () => getJob(jobId),
    enabled: Boolean(jobId),
  });

  const executionsQuery = useQuery({
    queryKey: [QUERY_KEYS.executions, jobId],
    queryFn: () => listExecutionsByJob(jobId),
    enabled: Boolean(jobId),
    refetchInterval: () => {
      const job = jobQuery.data;
      if (!job) {
        return false;
      }

      return ['SCHEDULED', 'EXECUTING'].includes(job.status) ? 8_000 : false;
    },
  });

  const selectedExecutionQuery = useQuery({
    queryKey: [QUERY_KEYS.execution, selectedExecutionId],
    queryFn: () => getExecution(selectedExecutionId as string),
    enabled: Boolean(selectedExecutionId),
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelJob(jobId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.job, jobId] });
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.jobs] });
    },
  });

  const rescheduleMutation = useMutation({
    mutationFn: (newScheduledAt: string) => rescheduleJob(jobId, { newScheduledAt }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.job, jobId] });
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.jobs] });
    },
  });

  const executions = useMemo(() => executionsQuery.data?.items ?? [], [executionsQuery.data]);

  return (
    <section>
      <h1>Job Details</h1>

      {jobQuery.data ? (
        <div className="card">
          <div className="details-header">
            <h2>{jobQuery.data.name}</h2>
            <StatusBadge value={jobQuery.data.status} />
          </div>

          <dl className="details-grid">
            <dt>ID</dt>
            <dd>{jobQuery.data.id}</dd>
            <dt>Task Type</dt>
            <dd>{jobQuery.data.taskType}</dd>
            <dt>Schedule Type</dt>
            <dd>{jobQuery.data.scheduleType}</dd>
            <dt>Recurrence</dt>
            <dd>{jobQuery.data.recurrenceFrequency ?? '-'}</dd>
            <dt>Scheduled At</dt>
            <dd>{formatDateTime(jobQuery.data.scheduledAt)}</dd>
            <dt>Updated At</dt>
            <dd>{formatDateTime(jobQuery.data.updatedAt)}</dd>
            <dt>Description</dt>
            <dd>{jobQuery.data.description || '-'}</dd>
          </dl>

          <div className="inline-actions">
            <button
              type="button"
              onClick={() => cancelMutation.mutate()}
              disabled={!['SCHEDULED', 'EXECUTING'].includes(jobQuery.data.status)}
            >
              Cancel Job
            </button>
            <button type="button" className="ghost-btn" onClick={() => setRescheduleOpen(true)}>
              Reschedule
            </button>
          </div>
        </div>
      ) : null}

      <div className="split-grid">
        <ExecutionList
          executions={executions}
          selectedExecutionId={selectedExecutionId}
          onSelect={setSelectedExecutionId}
        />
        <ExecutionDetailsPanel execution={selectedExecutionQuery.data} />
      </div>

      <RescheduleModal
        open={rescheduleOpen}
        onClose={() => setRescheduleOpen(false)}
        onSubmit={(newScheduledAt) => rescheduleMutation.mutateAsync(newScheduledAt)}
      />
    </section>
  );
};
