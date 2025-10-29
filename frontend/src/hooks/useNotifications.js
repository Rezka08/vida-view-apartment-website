import { useEffect } from 'react';
import useNotificationStore from '../stores/notificationStore';

const useNotifications = () => {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearError
  } = useNotificationStore();

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearError
  };
};

export default useNotifications;