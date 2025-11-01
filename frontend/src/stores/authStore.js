import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from '../api/axios'
import { toast } from 'react-hot-toast'
import {jwtDecode} from 'jwt-decode'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      // Initialize from localStorage
      initialize: () => {
        const token = localStorage.getItem('access_token')
        const refreshToken = localStorage.getItem('refresh_token')
        const user = localStorage.getItem('user')

        if (token && user) {
          try {
            // Check if token is expired
            const decoded = jwtDecode(token)
            const isExpired = decoded.exp * 1000 < Date.now()

            if (!isExpired) {
              set({
                user: JSON.parse(user),
                token,
                refreshToken,
                isAuthenticated: true,
              })
            } else {
              // Token expired, try to refresh
              get().refreshAccessToken()
            }
          } catch (error) {
            get().logout()
          }
        }
      },

      // Login
      login: async (credentials) => {
        set({ isLoading: true })
        try {
          const response = await axios.post('/auth/login', credentials)
          const { access_token, refresh_token, user } = response.data

          // Store tokens and user in BOTH places for immediate access
          localStorage.setItem('access_token', access_token)
          localStorage.setItem('refresh_token', refresh_token)
          localStorage.setItem('user', JSON.stringify(user))

          // Update Zustand state
          set({
            user,
            token: access_token,
            refreshToken: refresh_token,
            isAuthenticated: true,
            isLoading: false,
          })

          // Wait for localStorage to be flushed
          await new Promise(resolve => setTimeout(resolve, 200))

          toast.success('Login berhasil!')

          // Don't redirect here - let the Login component handle it
          // This ensures state is fully ready before redirect
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          toast.error(error.response?.data?.message || 'Login gagal')
          return { success: false, error }
        }
      },

      // Register
      register: async (userData) => {
        set({ isLoading: true })
        try {
          const response = await axios.post('/auth/register', userData)
          toast.success('Registrasi berhasil! Silakan login.')
          set({ isLoading: false })
          return { success: true, data: response.data }
        } catch (error) {
          set({ isLoading: false })
          toast.error(error.response?.data?.message || 'Registrasi gagal')
          return { success: false, error }
        }
      },

      // Logout
      logout: () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')

        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        })

        toast.success('Logout berhasil')
        window.location.href = '/login'
      },

      // Refresh access token
      refreshAccessToken: async () => {
        try {
          const refreshToken = localStorage.getItem('refresh_token')
          if (!refreshToken) {
            get().logout()
            return
          }

          const response = await axios.post('/auth/refresh', {}, {
            headers: {
              Authorization: `Bearer ${refreshToken}`
            }
          })

          const { access_token } = response.data
          localStorage.setItem('access_token', access_token)

          set({ token: access_token })
          return access_token
        } catch (error) {
          get().logout()
        }
      },

      // Update user profile
      updateUser: (updatedUser) => {
        localStorage.setItem('user', JSON.stringify(updatedUser))
        set({ user: updatedUser })
      },

      // Change password
      changePassword: async (currentPassword, newPassword) => {
        set({ isLoading: true })
        try {
          await axios.post('/auth/change-password', {
            current_password: currentPassword,
            new_password: newPassword,
          })
          set({ isLoading: false })
          toast.success('Password berhasil diubah')
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          toast.error(error.response?.data?.message || 'Gagal mengubah password')
          return { success: false, error }
        }
      },

      // Check if user has role
      hasRole: (role) => {
        const { user } = get()
        if (!user) return false
        return user.role === role
      },

      // Check if user has any of the roles
      hasAnyRole: (roles) => {
        const { user } = get()
        if (!user) return false
        return roles.includes(user.role)
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Initialize auth state on app load
if (typeof window !== 'undefined') {
  useAuthStore.getState().initialize()
}