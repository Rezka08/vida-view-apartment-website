import axios from './axios';

const promotionsAPI = {
  // Get all promotions
  getPromotions: async (params = {}) => {
    const response = await axios.get('/promotions', { params });
    return response.data;
  },

  // Get single promotion
  getPromotion: async (id) => {
    const response = await axios.get(`/promotions/${id}`);
    return response.data;
  },

  // Create promotion
  createPromotion: async (data) => {
    const response = await axios.post('/promotions', data);
    return response.data;
  },

  // Update promotion
  updatePromotion: async (id, data) => {
    const response = await axios.put(`/promotions/${id}`, data);
    return response.data;
  },

  // Delete promotion
  deletePromotion: async (id) => {
    const response = await axios.delete(`/promotions/${id}`);
    return response.data;
  },

  // Validate promo code
  validatePromoCode: async (code) => {
    const response = await axios.get(`/promotions/validate/${code}`);
    return response.data;
  }
};

export default promotionsAPI;
