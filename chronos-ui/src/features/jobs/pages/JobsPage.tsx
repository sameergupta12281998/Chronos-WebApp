import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cancelJob, createJob, listJobs } from '../../../api/jobs.api';
import { QUERY_KEYS } from '../../../lib/constants';
import type { ApiError, CreateJobRequest, JobStatus } from '../../../types/api';
import { JobCreateForm } from '../components/JobCreateForm';
import { JobListTable } from '../components/JobListTable';
import { ErrorBanner } from '../../../components/common/ErrorBanner';
import { EmptyState } from '../../../components/common/EmptyState';
import { toApiError } from '../../../api/client';

export const JobsPage = () => {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<JobStatus | ''>('');
  const [apiError, setApiError] = useState<ApiError | null>(null);

  const jobsQuery = useQuery({
    queryKey: [QUERY_KEYS.jobs, status],
    queryFn: () => listJobs({ page: 0, size: 20, status: status || undefined }),
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateJobRequest) => createJob(payload),
    onSuccess: async () => {
      setApiError(null);
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.jobs] });
    },
    onError: (error) => setApiError(toApiError(error)),
  });

  const cancelMutation = useMutation({
    mutationFn: (jobId: string) => cancelJob(jobId),
    onSuccess: async () => {
      setApiError(null);
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.jobs] });
    },
    onError: (error) => setApiError(toApiError(error)),
  });

  const jobs = useMemo(() => jobsQuery.data?.items ?? [], [jobsQuery.data]);

  return (
    <section>
      <h1>My Jobs</h1>
      <p className="page-subtitle">Create workloads and manage lifecycle actions for your account.</p>

      {apiError ? (
        <ErrorBanner message={apiError.message} details={apiError.details} title="Job action failed" />
      ) : null}

      <div className="jobs-layout">
        <JobCreateForm onCreate={async (payload) => createMutation.mutateAsync(payload)} />

        <div>
          <div className="toolbar card">
            <label>
              Status filter
              <select value={status} onChange={(event) => setStatus(event.target.value as JobStatus | '')}>
                <option value="">All</option>
                <option value="SCHEDULED">SCHEDULED</option>
                <option value="EXECUTING">EXECUTING</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="FAILED">FAILED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </label>
          </div>

          {jobs.length > 0 ? (
            <JobListTable jobs={jobs} onCancel={(jobId) => cancelMutation.mutate(jobId)} />
          ) : (
            <EmptyState
              title="No jobs found"
              subtitle="No jobs found for your account. Create your first job or adjust filters."
            />
          )}
        </div>
      </div>
    </section>
  );
};
