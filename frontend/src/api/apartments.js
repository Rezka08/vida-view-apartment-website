import api from './axios';

// Apartments API calls
export const apartmentsAPI = {
  // Get all apartments with filters
  getApartments: async (params = {}) => {
    const response = await api.get('/apartments', { params });
    return response.data;
  },

  // Get single apartment by ID
  getApartment: async (id) => {
    const response = await api.get(`/apartments/${id}`);
    return response.data;
  },

  // Create new apartment (Owner/Admin)
  createApartment: async (apartmentData) => {
    const response = await api.post('/apartments', apartmentData);
    return response.data;
  },

  // Update apartment (Owner/Admin)
  updateApartment: async (id, apartmentData) => {
    const response = await api.put(`/apartments/${id}`, apartmentData);
    return response.data;
  },

  // Delete apartment (Owner/Admin)
  deleteApartment: async (id) => {
    const response = await api.delete(`/apartments/${id}`);
    return response.data;
  },

  // Upload apartment photo
  uploadPhoto: async (id, formData) => {
    const response = await api.post(`/apartments/${id}/photos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Toggle favorite
  toggleFavorite: async (id) => {
    const response = await api.post(`/apartments/${id}/favorite`);
    return response.data;
  },

  // Get user favorites
  getFavorites: async () => {
    const response = await api.get('/apartments/favorites');
    return response.data;
  }
};

export default apartmentsAPI;