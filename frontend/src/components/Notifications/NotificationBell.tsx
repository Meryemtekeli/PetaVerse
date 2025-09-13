import React, { useState, useEffect } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { notificationApi } from '../../services/api/notificationApi';
import { useAuth } from '../../store/slices/authSlice';
import { NotificationList } from './NotificationList';

export const NotificationBell: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadUnreadCount();
      
      // Refresh count every 30 seconds
      const interval = setInterval(loadUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user?.id]);

  const loadUnreadCount = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const count = await notificationApi.getUnreadCount(user.id);
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBellClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      loadUnreadCount(); // Refresh when opening
    }
  };

  const handleNotificationRead = () => {
    // Decrease count when a notification is marked as read
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleNotificationDelete = () => {
    // Decrease count when a notification is deleted
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={handleBellClick}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg transition-colors"
        aria-label="Bildirimler"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Notification Panel */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
            <NotificationList
              showUnreadOnly={false}
              limit={10}
            />
          </div>
        </>
      )}
    </div>
  );
};
