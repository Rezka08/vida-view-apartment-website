import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { usersAPI } from '../api/users';

const useUserStore = create(
  persist(
    (set, get) => ({
      // State
      profile: null,
      loading: false,
      error: null,

      // Actions
      setProfile: (profile) => set({ profile, error: null }),

      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ error }),

      // Fetch current user profile
      fetchProfile: async () => {
        set({ loading: true, error: null });
        try {
          const data = await usersAPI.getProfile();
          set({ profile: data, loading: false });
          return data;
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Gagal mengambil data profil';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      // Update profile
      updateProfile: async (profileData) => {
        set({ loading: true, error: null });
        try {
          const data = await usersAPI.updateProfile(profileData);
          set({ profile: data.user, loading: false });
          return data;
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Gagal memperbarui profil';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      // Upload profile photo
      uploadProfilePhoto: async (file) => {
        set({ loading: true, error: null });
        try {
          const formData = new FormData();
          formData.append('photo', file);
          
          const data = await usersAPI.uploadProfilePhoto(formData);
          
          // Update profile with new photo URL
          const currentProfile = get().profile;
          set({ 
            profile: { ...currentProfile, profile_photo: data.photo_url }, 
            loading: false 
          });
          
          return data;
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Gagal mengunggah foto';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      // Upload documents
      uploadDocuments: async (files) => {
        set({ loading: true, error: null });
        try {
          const formData = new FormData();
          
          if (files.idCard) {
            formData.append('id_card', files.idCard);
          }
          
          if (files.idCardNumber) {
            formData.append('id_card_number', files.idCardNumber);
          }
          
          const data = await usersAPI.uploadDocuments(formData);
          set({ profile: data.user, loading: false });
          return data;
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Gagal mengunggah dokumen';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      // Clear profile
      clearProfile: () => set({ profile: null, error: null }),

      // Clear error
      clearError: () => set({ error: null })
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        profile: state.profile
      })
    }
  )
);

export default useUserStore;