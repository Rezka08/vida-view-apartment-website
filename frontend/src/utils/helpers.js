// Helper utility functions
import { STATUS_COLORS } from './constants';

/**
 * Get status badge class based on status
 * @param {string} status - Status value
 * @returns {string} Tailwind CSS classes for badge
 */
export const getStatusBadgeClass = (status) => {
  return STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Get status text in Indonesian
 * @param {string} status - Status value
 * @param {string} type - Type of status (booking, payment, etc)
 * @returns {string} Localized status text
 */
export const getStatusText = (status, type = 'booking') => {
  const statusTexts = {
    booking: {
      pending: 'Menunggu',
      confirmed: 'Dikonfirmasi',
      active: 'Aktif',
      completed: 'Selesai',
      cancelled: 'Dibatalkan',
      rejected: 'Ditolak'
    },
    payment: {
      pending: 'Menunggu Pembayaran',
      verifying: 'Menunggu Verifikasi',
      completed: 'Lunas',
      failed: 'Gagal',
      refunded: 'Dikembalikan'
    },
    apartment: {
      available: 'Tersedia',
      occupied: 'Terisi'
    }
  };
  
  return statusTexts[type]?.[status] || status;
};

/**
 * Calculate months between two dates
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {number} Number of months
 */
export const calculateMonths = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return (end.getFullYear() - start.getFullYear()) * 12 + 
         (end.getMonth() - start.getMonth());
};

/**
 * Calculate total booking amount
 * @param {number} monthlyRent - Monthly rent amount
 * @param {number} months - Number of months
 * @param {number} deposit - Deposit amount
 * @param {number} utilityDeposit - Utility deposit amount
 * @param {number} adminFee - Admin fee amount
 * @returns {number} Total amount
 */
export const calculateBookingTotal = (
  monthlyRent, 
  months, 
  deposit = 0, 
  utilityDeposit = 0, 
  adminFee = 0
) => {
  return (monthlyRent * months) + deposit + utilityDeposit + adminFee;
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Generate random string
 * @param {number} length - Length of string
 * @returns {string} Random string
 */
export const generateRandomString = (length = 10) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
};

/**
 * Download file from URL
 * @param {string} url - File URL
 * @param {string} filename - Filename to save as
 */
export const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

/**
 * Get image URL with fallback
 * @param {string} imageUrl - Image URL
 * @param {string} fallback - Fallback image URL
 * @returns {string} Image URL
 */
export const getImageUrl = (imageUrl, fallback = '/placeholder.jpg') => {
  if (!imageUrl) return fallback;
  
  // If URL is relative, prepend API base URL
  if (imageUrl.startsWith('/uploads/')) {
    return import.meta.env.VITE_API_URL + imageUrl;
  }
  
  return imageUrl;
};

/**
 * Parse query string to object
 * @param {string} queryString - Query string
 * @returns {object} Query parameters object
 */
export const parseQueryString = (queryString) => {
  const params = new URLSearchParams(queryString);
  const result = {};
  
  for (const [key, value] of params) {
    result[key] = value;
  }
  
  return result;
};

/**
 * Build query string from object
 * @param {object} params - Query parameters object
 * @returns {string} Query string
 */
export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
      searchParams.append(key, params[key]);
    }
  });
  
  return searchParams.toString();
};

/**
 * Group array by key
 * @param {Array} array - Array to group
 * @param {string} key - Key to group by
 * @returns {object} Grouped object
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

/**
 * Sort array by key
 * @param {Array} array - Array to sort
 * @param {string} key - Key to sort by
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {Array} Sorted array
 */
export const sortBy = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    if (order === 'asc') {
      return a[key] > b[key] ? 1 : -1;
    } else {
      return a[key] < b[key] ? 1 : -1;
    }
  });
};

/**
 * Check if user has permission based on role
 * @param {string} userRole - User's role
 * @param {string[]} allowedRoles - Array of allowed roles
 * @returns {boolean} Has permission
 */
export const hasPermission = (userRole, allowedRoles) => {
  return allowedRoles.includes(userRole);
};

/**
 * Sleep/delay function
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after delay
 */
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export default {
  getStatusBadgeClass,
  getStatusText,
  calculateMonths,
  calculateBookingTotal,
  debounce,
  generateRandomString,
  downloadFile,
  copyToClipboard,
  getImageUrl,
  parseQueryString,
  buildQueryString,
  groupBy,
  sortBy,
  hasPermission,
  sleep
};