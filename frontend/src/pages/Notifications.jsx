import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  BellIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  EnvelopeOpenIcon,
  CalendarIcon,
  CreditCardIcon,
  BuildingOfficeIcon,
  UserIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import notificationsAPI from '../api/notifications';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import Pagination from '../components/common/Pagination';
import { formatRelativeTime } from '../utils/formatters';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchNotifications();
  }, [filter, pagination.page]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        per_page: pagination.per_page
      };

      if (filter === 'unread') {
        params.is_read = 'false';
      } else if (filter === 'read') {
        params.is_read = 'true';
      }

      const response = await notificationsAPI.getNotifications(params);
      setNotifications(response.notifications);
      setPagination(response.pagination);
    } catch (error) {
      toast.error('Gagal memuat notifikasi');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationsAPI.markAsRead(notificationId);
      fetchNotifications();
    } catch (error) {
      toast.error('Gagal menandai notifikasi');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      toast.success('Semua notifikasi ditandai telah dibaca');
      fetchNotifications();
    } catch (error) {
      toast.error('Gagal menandai semua notifikasi');
    }
  };

  const handleDelete = async (notificationId) => {
    if (!window.confirm('Hapus notifikasi ini?')) return;

    try {
      await notificationsAPI.deleteNotification(notificationId);
      toast.success('Notifikasi dihapus');
      fetchNotifications();
    } catch (error) {
      toast.error('Gagal menghapus notifikasi');
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read if unread
    if (!notification.is_read) {
      await handleMarkAsRead(notification.id);
    }

    // Navigate based on notification type and related entity
    if (notification.related_id) {
      switch (notification.notification_type) {
        case 'booking':
          navigate(`/my-bookings`);
          break;
        case 'payment':
          navigate(`/my-payments`);
          break;
        case 'apartment':
          navigate(`/apartments/${notification.related_id}`);
          break;
        default:
          break;
      }
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking':
        return <CalendarIcon className="h-6 w-6 text-blue-500" />;
      case 'payment':
        return <CreditCardIcon className="h-6 w-6 text-green-500" />;
      case 'apartment':
        return <BuildingOfficeIcon className="h-6 w-6 text-purple-500" />;
      case 'user':
        return <UserIcon className="h-6 w-6 text-gray-500" />;
      case 'alert':
        return <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />;
      case 'info':
        return <InformationCircleIcon className="h-6 w-6 text-blue-400" />;
      default:
        return <BellIcon className="h-6 w-6 text-gray-400" />;
    }
  };

  const filters = [
    { value: 'all', label: 'Semua' },
    { value: 'unread', label: 'Belum Dibaca' },
    { value: 'read', label: 'Sudah Dibaca' }
  ];

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading && notifications.length === 0) {
    return <Loading fullScreen text="Memuat notifikasi..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifikasi</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {unreadCount} notifikasi belum dibaca
            </p>
          )}
        </div>

        {notifications.length > 0 && unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
          >
            <EnvelopeOpenIcon className="h-4 w-4 mr-2" />
            Tandai Semua Dibaca
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => {
              setFilter(f.value);
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.value
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg shadow-sm border transition-all hover:shadow-md ${
                notification.is_read
                  ? 'border-gray-200'
                  : 'border-purple-200 bg-purple-50/30'
              }`}
            >
              <div className="p-4">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.notification_type)}
                  </div>

                  {/* Content */}
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`font-semibold ${
                        notification.is_read ? 'text-gray-700' : 'text-gray-900'
                      }`}>
                        {notification.title}
                      </h3>
                      {!notification.is_read && (
                        <span className="flex-shrink-0 h-2 w-2 bg-purple-600 rounded-full mt-2"></span>
                      )}
                    </div>
                    <p className={`text-sm ${
                      notification.is_read ? 'text-gray-500' : 'text-gray-700'
                    }`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {formatRelativeTime(notification.created_at)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!notification.is_read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Tandai telah dibaca"
                      >
                        <CheckCircleIcon className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notification.id);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus notifikasi"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg">
          <BellIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg font-medium mb-2">
            {filter === 'unread' ? 'Tidak ada notifikasi baru' : 'Belum ada notifikasi'}
          </p>
          <p className="text-gray-500 text-sm">
            {filter === 'unread'
              ? 'Semua notifikasi sudah dibaca'
              : 'Notifikasi akan muncul di sini'
            }
          </p>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
        />
      )}
    </div>
  );
};

export default Notifications;
