import api from './axios';

// Payments API calls
export const paymentsAPI = {
  // Get all payments (filtered by user role)
  getPayments: async (params = {}) => {
    const response = await api.get('/payments', { params });
    return response.data;
  },

  // Get single payment by ID
  getPayment: async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  // Get payments for a booking
  getBookingPayments: async (bookingId) => {
    const response = await api.get(`/payments/booking/${bookingId}`);
    return response.data;
  },

  // Create payment (Admin only)
  createPayment: async (paymentData) => {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },

  // Confirm payment (upload proof)
  confirmPayment: async (id, paymentData) => {
    const response = await api.post(`/payments/${id}/confirm`, paymentData);
    return response.data;
  },

  // Verify payment (Owner/Admin)
  verifyPayment: async (id, verificationData) => {
    const response = await api.post(`/payments/${id}/verify`, verificationData);
    return response.data;
  }
};

export default paymentsAPI;