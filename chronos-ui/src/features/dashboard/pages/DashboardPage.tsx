import { useQuery } from '@tanstack/react-query';
import { listJobs } from '../../../api/jobs.api';
import { QUERY_KEYS } from '../../../lib/constants';
import { KpiCards } from '../components/KpiCards';

export const DashboardPage = () => {
  const jobsQuery = useQuery({
    queryKey: [QUERY_KEYS.jobs, 'dashboard'],
    queryFn: () => listJobs({ page: 0, size: 100 }),
  });

  const items = jobsQuery.data?.items ?? [];

  const activeJobs = items.filter((job) => ['SCHEDULED', 'EXECUTING'].includes(job.status)).length;
  const failedJobs = items.filter((job) => job.status === 'FAILED').length;

  return (
    <section>
      <h1>Dashboard</h1>
      <p className="page-subtitle">Operational overview for jobs in your account.</p>
      <KpiCards totalJobs={items.length} activeJobs={activeJobs} failedJobs={failedJobs} />
    </section>
  );
};
