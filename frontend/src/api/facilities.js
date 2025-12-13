import api from './axios';

// Facilities API calls
export const facilitiesAPI = {
  // Get all facilities
  getFacilities: async (params = {}) => {
    const response = await api.get('/facilities', { params });
    return response.data;
  },

  // Get single facility
  getFacility: async (id) => {
    const response = await api.get(`/facilities/${id}`);
    return response.data;
  },

  // Create facility (Admin only)
  createFacility: async (facilityData) => {
    const response = await api.post('/facilities', facilityData);
    return response.data;
  },

  // Create custom facility (Owner/Admin)
  createCustomFacility: async (facilityName) => {
    const response = await api.post('/facilities/custom', { name: facilityName });
    return response.data;
  },

  // Update facility (Admin only)
  updateFacility: async (id, facilityData) => {
    const response = await api.put(`/facilities/${id}`, facilityData);
    return response.data;
  },

  // Delete facility (Admin only)
  deleteFacility: async (id) => {
    const response = await api.delete(`/facilities/${id}`);
    return response.data;
  }
};

export default facilitiesAPI;
