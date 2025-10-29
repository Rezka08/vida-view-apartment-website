import api from './axios';

// Admin API calls
export const adminAPI = {
  // Get admin dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // Get owner dashboard stats
  getOwnerDashboard: async () => {
    const response = await api.get('/admin/owner-dashboard');
    return response.data;
  },

  // Get occupancy report
  getOccupancyReport: async () => {
    const response = await api.get('/admin/reports/occupancy');
    return response.data;
  },

  // Get revenue report
  getRevenueReport: async (params = {}) => {
    const response = await api.get('/admin/reports/revenue', { params });
    return response.data;
  },

  // Get top apartments
  getTopApartments: async (params = {}) => {
    const response = await api.get('/admin/reports/top-apartments', { params });
    return response.data;
  }
};

export default adminAPI;