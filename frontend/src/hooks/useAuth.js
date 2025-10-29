import { useAuthStore } from '../stores/authStore';

const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshAccessToken,
    updateUser,
    changePassword,
    hasRole,
    hasAnyRole
  } = useAuthStore();

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshAccessToken,
    updateUser,
    changePassword,
    hasRole,
    hasAnyRole,
    // Helper functions
    isTenant: user?.role === 'tenant',
    isOwner: user?.role === 'owner',
    isAdmin: user?.role === 'admin'
  };
};

export default useAuth;