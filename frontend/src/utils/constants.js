// Application constants

// User roles
export const USER_ROLES = {
  TENANT: 'tenant',
  OWNER: 'owner',
  ADMIN: 'admin'
};

// Booking status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REJECTED: 'rejected'
};

// Payment status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

// Payment types
export const PAYMENT_TYPES = {
  DEPOSIT: 'deposit',
  MONTHLY_RENT: 'monthly_rent',
  PENALTY: 'penalty',
  REFUND: 'refund',
  UTILITY: 'utility'
};

// Payment methods
export const PAYMENT_METHODS = {
  BANK_TRANSFER: 'bank_transfer',
  CREDIT_CARD: 'credit_card',
  E_WALLET: 'e_wallet',
  CASH: 'cash'
};

// Apartment status
export const APARTMENT_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied'
};

// Unit types
export const UNIT_TYPES = [
  'Studio',
  '1BR',
  '2BR',
  '3BR',
  'Penthouse'
];

// Photo types
export const PHOTO_TYPES = {
  MAIN: 'main',
  BEDROOM: 'bedroom',
  BATHROOM: 'bathroom',
  KITCHEN: 'kitchen',
  LIVING_ROOM: 'living_room',
  BALCONY: 'balcony',
  OTHER: 'other'
};

// Notification types
export const NOTIFICATION_TYPES = {
  BOOKING: 'booking',
  PAYMENT: 'payment',
  SYSTEM: 'system',
  PROMOTION: 'promotion'
};

// Status colors for UI
export const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  active: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
  rejected: 'bg-red-100 text-red-800',
  available: 'bg-green-100 text-green-800',
  occupied: 'bg-gray-100 text-gray-800'
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'DD MMMM YYYY',
  INPUT: 'YYYY-MM-DD',
  DATETIME: 'DD MMM YYYY HH:mm'
};

// Pagination
export const ITEMS_PER_PAGE = 10;

// File upload limits
export const MAX_FILE_SIZE = 16 * 1024 * 1024; // 16MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
export const ALLOWED_DOCUMENT_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

export default {
  USER_ROLES,
  BOOKING_STATUS,
  PAYMENT_STATUS,
  PAYMENT_TYPES,
  PAYMENT_METHODS,
  APARTMENT_STATUS,
  UNIT_TYPES,
  PHOTO_TYPES,
  NOTIFICATION_TYPES,
  STATUS_COLORS,
  DATE_FORMATS,
  ITEMS_PER_PAGE,
  MAX_FILE_SIZE,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_DOCUMENT_TYPES
};