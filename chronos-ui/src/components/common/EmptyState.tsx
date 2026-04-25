interface EmptyStateProps {
  title: string;
  subtitle?: string;
}

export const EmptyState = ({ title, subtitle }: EmptyStateProps) => (
  <div className="empty-state">
    <h3>{title}</h3>
    {subtitle && <p>{subtitle}</p>}
  </div>
);
