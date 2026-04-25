import type { ReactNode } from 'react';

interface ErrorBannerProps {
  title?: string;
  message: string;
  details?: string[];
  action?: ReactNode;
}

export const ErrorBanner = ({
  title = 'Something went wrong',
  message,
  details,
  action,
}: ErrorBannerProps) => {
  return (
    <div className="error-banner" role="alert">
      <h4>{title}</h4>
      <p>{message}</p>
      {details && details.length > 0 && (
        <ul>
          {details.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      {action}
    </div>
  );
};
