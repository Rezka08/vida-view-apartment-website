import api from './axios';

// Bookings API calls
export const bookingsAPI = {
  // Get all bookings (filtered by user role)
  getBookings: async (params = {}) => {
    const response = await api.get('/bookings', { params });
    return response.data;
  },

  // Get single booking by ID
  getBooking: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  // Create new booking
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Update booking (Admin only)
  updateBooking: async (id, bookingData) => {
    const response = await api.put(`/bookings/${id}`, bookingData);
    return response.data;
  },

  // Approve booking (Owner/Admin)
  approveBooking: async (id) => {
    const response = await api.post(`/bookings/${id}/approve`);
    return response.data;
  },

  // Reject booking (Owner/Admin)
  rejectBooking: async (id, reason) => {
    const response = await api.post(`/bookings/${id}/reject`, { reason });
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id) => {
    const response = await api.post(`/bookings/${id}/cancel`);
    return response.data;
  }
};

export default bookingsAPI;