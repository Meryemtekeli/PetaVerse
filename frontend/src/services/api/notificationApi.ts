import { apiClient } from './apiClient';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  status: string;
  isRead: boolean;
  isSent: boolean;
  sentAt?: string;
  readAt?: string;
  actionUrl?: string;
  actionData?: string;
  createdAt: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface NotificationPage {
  content: Notification[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const notificationApi = {
  // Get user notifications
  getUserNotifications: async (userId: number): Promise<Notification[]> => {
    const response = await apiClient.get('/notifications', {
      params: { userId }
    });
    return response.data;
  },

  // Get user notifications with pagination
  getUserNotificationsPaginated: async (
    userId: number,
    page: number = 0,
    size: number = 20
  ): Promise<NotificationPage> => {
    const response = await apiClient.get('/notifications/paginated', {
      params: { userId, page, size }
    });
    return response.data;
  },

  // Get unread notifications
  getUnreadNotifications: async (userId: number): Promise<Notification[]> => {
    const response = await apiClient.get('/notifications/unread', {
      params: { userId }
    });
    return response.data;
  },

  // Get unread notification count
  getUnreadCount: async (userId: number): Promise<number> => {
    const response = await apiClient.get('/notifications/unread/count', {
      params: { userId }
    });
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (notificationId: number, userId: number): Promise<void> => {
    await apiClient.put(`/notifications/${notificationId}/read`, null, {
      params: { userId }
    });
  },

  // Mark all notifications as read
  markAllAsRead: async (userId: number): Promise<void> => {
    await apiClient.put('/notifications/read-all', null, {
      params: { userId }
    });
  },

  // Delete notification
  deleteNotification: async (notificationId: number, userId: number): Promise<void> => {
    await apiClient.delete(`/notifications/${notificationId}`, {
      params: { userId }
    });
  },

  // Send test notification
  sendTestNotification: async (
    userId: number,
    title: string,
    message: string
  ): Promise<Notification> => {
    const response = await apiClient.post('/notifications/test', null, {
      params: { userId, title, message }
    });
    return response.data;
  }
};
