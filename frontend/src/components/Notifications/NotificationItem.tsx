import React from 'react';
import { Notification } from '../../services/api/notificationApi';
import { useAuth } from '../../store/slices/authSlice';
import { notificationApi } from '../../services/api/notificationApi';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (notificationId: number) => void;
  onDelete?: (notificationId: number) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete
}) => {
  const { user } = useAuth();

  const handleMarkAsRead = async () => {
    if (!user || notification.isRead) return;
    
    try {
      await notificationApi.markAsRead(notification.id, user.id);
      onMarkAsRead?.(notification.id);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    
    try {
      await notificationApi.deleteNotification(notification.id, user.id);
      onDelete?.(notification.id);
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'ADOPTION_REQUEST':
        return '🏠';
      case 'NEW_MESSAGE':
        return '💬';
      case 'LOST_PET_FOUND':
        return '🔍';
      case 'VACCINATION_REMINDER':
        return '💉';
      case 'SYSTEM_ANNOUNCEMENT':
        return '📢';
      case 'WELCOME':
        return '👋';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'ADOPTION_REQUEST':
        return 'bg-green-100 text-green-800';
      case 'NEW_MESSAGE':
        return 'bg-blue-100 text-blue-800';
      case 'LOST_PET_FOUND':
        return 'bg-red-100 text-red-800';
      case 'VACCINATION_REMINDER':
        return 'bg-yellow-100 text-yellow-800';
      case 'SYSTEM_ANNOUNCEMENT':
        return 'bg-purple-100 text-purple-800';
      case 'WELCOME':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Şimdi';
    if (diffInMinutes < 60) return `${diffInMinutes} dakika önce`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} saat önce`;
    return date.toLocaleDateString('tr-TR');
  };

  return (
    <div
      className={`p-4 border-b hover:bg-gray-50 transition-colors ${
        !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
            !notification.isRead ? 'bg-blue-100' : 'bg-gray-100'
          }`}>
            {getNotificationIcon(notification.type)}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className={`text-sm font-medium ${
              !notification.isRead ? 'text-gray-900' : 'text-gray-700'
            }`}>
              {notification.title}
            </h4>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getNotificationColor(notification.type)}`}>
                {notification.type.replace('_', ' ')}
              </span>
              <span className="text-xs text-gray-500">
                {formatTime(notification.createdAt)}
              </span>
            </div>
          </div>
          
          <p className={`text-sm mt-1 ${
            !notification.isRead ? 'text-gray-800' : 'text-gray-600'
          }`}>
            {notification.message}
          </p>
          
          {notification.actionUrl && (
            <div className="mt-2">
              <a
                href={notification.actionUrl}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                onClick={handleMarkAsRead}
              >
                Detayları Görüntüle →
              </a>
            </div>
          )}
        </div>
        
        <div className="flex-shrink-0 flex flex-col space-y-1">
          {!notification.isRead && (
            <button
              onClick={handleMarkAsRead}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              title="Okundu olarak işaretle"
            >
              ✓
            </button>
          )}
          <button
            onClick={handleDelete}
            className="text-xs text-red-600 hover:text-red-800"
            title="Sil"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};
