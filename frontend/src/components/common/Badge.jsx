import React from 'react';
import { getStatusBadgeClass } from '../../utils/helpers';

const Badge = ({
  children,
  variant = 'default',
  status = null,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-purple-100 text-purple-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };

  // If status is provided, use status-based colors
  const badgeClass = status 
    ? getStatusBadgeClass(status)
    : variantClasses[variant];

  const classes = `inline-flex items-center font-medium rounded-full ${sizeClasses[size]} ${badgeClass} ${className}`;

  return (
    <span className={classes}>
      {children}
    </span>
  );
};

export default Badge;