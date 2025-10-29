import { create } from 'zustand';
import api from '../api/axios';

export const useNotificationStore = create((set, get) => ({
  // State
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,

  // Actions
  setNotifications: (notifications) => set({ notifications }),

  setUnreadCount: (count) => set({ unreadCount: count }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  // Fetch notifications
  fetchNotifications: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/notifications', { params });
      set({ 
        notifications: response.data.notifications, 
        loading: false 
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Gagal mengambil notifikasi';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Fetch unread count
  fetchUnreadCount: async () => {
    try {
      const response = await api.get('/notifications/unread-count');
      set({ unreadCount: response.data.unread_count });
      return response.data.unread_count;
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      await api.post(`/notifications/${notificationId}/read`);
      
      // Update local state
      const notifications = get().notifications.map(notif =>
        notif.id === notificationId ? { ...notif, is_read: true } : notif
      );
      
      const unreadCount = notifications.filter(n => !n.is_read).length;
      
      set({ notifications, unreadCount });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Gagal menandai notifikasi';
      set({ error: errorMessage });
      throw error;
    }
  },

  // Mark all as read
  markAllAsRead: async () => {
    try {
      await api.post('/notifications/mark-all-read');
      
      // Update local state
      const notifications = get().notifications.map(notif => ({
        ...notif,
        is_read: true
      }));
      
      set({ notifications, unreadCount: 0 });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Gagal menandai semua notifikasi';
      set({ error: errorMessage });
      throw error;
    }
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      
      // Update local state
      const notifications = get().notifications.filter(
        notif => notif.id !== notificationId
      );
      
      const unreadCount = notifications.filter(n => !n.is_read).length;
      
      set({ notifications, unreadCount });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Gagal menghapus notifikasi';
      set({ error: errorMessage });
      throw error;
    }
  },

  // Add notification (for real-time updates)
  addNotification: (notification) => {
    const notifications = [notification, ...get().notifications];
    const unreadCount = get().unreadCount + 1;
    set({ notifications, unreadCount });
  },

  // Clear all notifications
  clearNotifications: () => set({ 
    notifications: [], 
    unreadCount: 0, 
    error: null 
  }),

  // Clear error
  clearError: () => set({ error: null })
}));