import React from 'react';
import { formatRelativeTime } from '../../utils/formatters';
import Badge from '../common/Badge';

const RecentActivity = ({ activities = [], title = "Aktivitas Terbaru" }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="text-center py-8 text-gray-400">
          Belum ada aktivitas
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={activity.id || index}
            className="flex items-start space-x-3 pb-4 border-b last:border-0"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-semibold text-sm">
                {activity.type?.charAt(0).toUpperCase()}
              </span>
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                {activity.message || activity.title}
              </p>
              {activity.status && (
                <Badge status={activity.status} size="sm" className="mt-1">
                  {activity.status}
                </Badge>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {formatRelativeTime(activity.created_at || activity.date)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;