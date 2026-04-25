import type { NotificationResponse } from '../../../types/api';
import { formatDateTime } from '../../../lib/date';

interface NotificationListProps {
  notifications: NotificationResponse[];
  selectedId?: string;
  onSelect: (notificationId: string) => void;
}

export const NotificationList = ({
  notifications,
  selectedId,
  onSelect,
}: NotificationListProps) => {
  return (
    <div className="card">
      <h2>Notifications</h2>
      <ul className="list-stack">
        {notifications.map((notification) => (
          <li key={notification.id}>
            <button
              type="button"
              className={`list-item-btn ${selectedId === notification.id ? 'active' : ''}`}
              onClick={() => onSelect(notification.id)}
            >
              <div>
                <strong>{notification.type}</strong>
                <p>{notification.message}</p>
              </div>
              <span>{formatDateTime(notification.createdAt)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
