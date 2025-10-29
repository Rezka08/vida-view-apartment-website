import React from 'react';

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType = 'neutral',
  subtitle 
}) => {
  const changeColors = {
    positive: 'text-green-600 bg-green-50',
    negative: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50'
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <Icon className="h-6 w-6 text-purple-600" />
          </div>
        )}
      </div>
      
      {change !== undefined && (
        <div className="flex items-center">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${changeColors[changeType]}`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
          <span className="text-xs text-gray-500 ml-2">vs bulan lalu</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;