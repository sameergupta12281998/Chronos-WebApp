import { apiClient } from './client';
import type { NotificationResponse, PageResponse } from '../types/api';

export interface ListNotificationsParams {
  page?: number;
  size?: number;
}

export const listNotifications = async (
  params: ListNotificationsParams,
): Promise<PageResponse<NotificationResponse>> => {
  const response = await apiClient.get<PageResponse<NotificationResponse>>('/api/v1/notifications', {
    params,
  });

  return response.data;
};

export const getNotification = async (notificationId: string): Promise<NotificationResponse> => {
  const response = await apiClient.get<NotificationResponse>(`/api/v1/notifications/${notificationId}`);
  return response.data;
};
