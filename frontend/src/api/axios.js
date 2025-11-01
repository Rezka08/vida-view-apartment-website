import axios from 'axios'
import { toast } from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Try to get token from localStorage first
    let token = localStorage.getItem('access_token')

    // If not found, try to get from Zustand persist storage
    if (!token) {
      try {
        const authStorage = localStorage.getItem('auth-storage')
        if (authStorage) {
          const parsed = JSON.parse(authStorage)
          token = parsed.state?.token
        }
      } catch (e) {
        console.error('Error parsing auth-storage:', e)
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh token
        let refreshToken = localStorage.getItem('refresh_token')

        // If not found, try to get from Zustand persist storage
        if (!refreshToken) {
          try {
            const authStorage = localStorage.getItem('auth-storage')
            if (authStorage) {
              const parsed = JSON.parse(authStorage)
              refreshToken = parsed.state?.refreshToken
            }
          } catch (e) {
            console.error('Error parsing auth-storage:', e)
          }
        }

        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh`, {}, {
            headers: {
              Authorization: `Bearer ${refreshToken}`
            }
          })

          const { access_token } = response.data
          localStorage.setItem('access_token', access_token)

          // Update Zustand storage too
          try {
            const authStorage = localStorage.getItem('auth-storage')
            if (authStorage) {
              const parsed = JSON.parse(authStorage)
              parsed.state.token = access_token
              localStorage.setItem('auth-storage', JSON.stringify(parsed))
            }
          } catch (e) {
            console.error('Error updating auth-storage:', e)
          }

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`
          return axiosInstance(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        localStorage.removeItem('auth-storage')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // Handle other errors
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Terjadi kesalahan. Silakan coba lagi.'

    if (error.response?.status !== 401) {
      toast.error(errorMessage)
    }

    return Promise.reject(error)
  }
)

export default axiosInstance