interface KpiCardsProps {
  totalJobs: number;
  activeJobs: number;
  failedJobs: number;
}

export const KpiCards = ({ totalJobs, activeJobs, failedJobs }: KpiCardsProps) => {
  return (
    <div className="kpi-grid">
      <article className="kpi-card">
        <p>My Total Jobs</p>
        <h3>{totalJobs}</h3>
      </article>
      <article className="kpi-card">
        <p>My Active Jobs</p>
        <h3>{activeJobs}</h3>
      </article>
      <article className="kpi-card">
        <p>My Failed Jobs</p>
        <h3>{failedJobs}</h3>
      </article>
    </div>
  );
};
