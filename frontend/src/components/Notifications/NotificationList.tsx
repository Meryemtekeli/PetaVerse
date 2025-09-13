import React, { useState, useEffect } from 'react';
import { Notification, notificationApi } from '../../services/api/notificationApi';
import { useAuth } from '../../store/slices/authSlice';
import { NotificationItem } from './NotificationItem';

interface NotificationListProps {
  showUnreadOnly?: boolean;
  limit?: number;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  showUnreadOnly = false,
  limit
}) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadNotifications();
    }
  }, [user?.id, showUnreadOnly]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      let fetchedNotifications: Notification[];
      
      if (showUnreadOnly) {
        fetchedNotifications = await notificationApi.getUnreadNotifications(user!.id);
      } else {
        fetchedNotifications = await notificationApi.getUserNotifications(user!.id);
      }

      if (limit) {
        fetchedNotifications = fetchedNotifications.slice(0, limit);
      }

      setNotifications(fetchedNotifications);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      setError('Bildirimler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = (notificationId: number) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const handleDelete = (notificationId: number) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;

    try {
      await notificationApi.markAllAsRead(user.id);
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, isRead: true }))
      );
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 text-4xl mb-2">⚠️</div>
        <p className="text-red-600">{error}</p>
        <button
          onClick={loadNotifications}
          className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {showUnreadOnly ? 'Okunmamış Bildirimler' : 'Bildirimler'}
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {unreadCount}
              </span>
            )}
          </h3>
          {!showUnreadOnly && unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Tümünü Okundu İşaretle
            </button>
          )}
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 text-4xl mb-2">🔔</div>
            <p className="text-gray-500">
              {showUnreadOnly ? 'Okunmamış bildirim yok' : 'Henüz bildirim yok'}
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};
