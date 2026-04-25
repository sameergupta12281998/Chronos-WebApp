import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getNotification, listNotifications } from '../../../api/notifications.api';
import { QUERY_KEYS } from '../../../lib/constants';
import { NotificationList } from '../components/NotificationList';
import { EmptyState } from '../../../components/common/EmptyState';
import { formatDateTime } from '../../../lib/date';

export const NotificationsPage = () => {
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | undefined>();

  const notificationsQuery = useQuery({
    queryKey: [QUERY_KEYS.notifications],
    queryFn: () => listNotifications({ page: 0, size: 20 }),
  });

  const detailsQuery = useQuery({
    queryKey: [QUERY_KEYS.notification, selectedNotificationId],
    queryFn: () => getNotification(selectedNotificationId as string),
    enabled: Boolean(selectedNotificationId),
  });

  const notifications = notificationsQuery.data?.items ?? [];

  return (
    <section>
      <h1>Notification Feed</h1>
      <p className="page-subtitle">Recent execution updates across your jobs.</p>

      <div className="split-grid">
        {notifications.length > 0 ? (
          <NotificationList
            notifications={notifications}
            selectedId={selectedNotificationId}
            onSelect={setSelectedNotificationId}
          />
        ) : (
          <EmptyState title="No notifications yet" subtitle="Execution updates will appear here." />
        )}

        <div className="card">
          <h2>Notification Details</h2>
          {detailsQuery.data ? (
            <dl className="details-grid">
              <dt>ID</dt>
              <dd>{detailsQuery.data.id}</dd>
              <dt>Job ID</dt>
              <dd>{detailsQuery.data.jobId}</dd>
              <dt>Type</dt>
              <dd>{detailsQuery.data.type}</dd>
              <dt>Message</dt>
              <dd>{detailsQuery.data.message}</dd>
              <dt>Created</dt>
              <dd>{formatDateTime(detailsQuery.data.createdAt)}</dd>
              <dt>Dispatched</dt>
              <dd>{formatDateTime(detailsQuery.data.dispatchedAt)}</dd>
            </dl>
          ) : (
            <p>Select a notification to inspect payload details.</p>
          )}
        </div>
      </div>
    </section>
  );
};
