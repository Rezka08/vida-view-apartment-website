import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import apartmentsAPI from '../../api/apartments';
import useAuthStore from '../../stores/authStore';
import ApartmentCard from '../../components/apartment/ApartmentCard';
import ApartmentFilters from '../../components/apartment/ApartmentFilters';
import Pagination from '../../components/common/Pagination';
import Loading from '../../components/common/Loading';

const ApartmentList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [apartments, setApartments] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 12,
    total: 0,
    pages: 0
  });

  const { isAuthenticated } = useAuthStore();

  // Fetch apartments
  const fetchApartments = async (filters = {}) => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        per_page: pagination.per_page,
        ...filters
      };

      const response = await apartmentsAPI.getApartments(params);
      setApartments(response.apartments);
      setPagination(response.pagination);
    } catch (error) {
      toast.error('Gagal memuat data apartemen');
      console.error('Error fetching apartments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch favorites
  const fetchFavorites = async () => {
    if (!isAuthenticated) return;

    try {
      const response = await apartmentsAPI.getFavorites();
      setFavorites(response.favorites.map(fav => fav.apartment_id));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  useEffect(() => {
    fetchApartments();
    fetchFavorites();
  }, [pagination.page]);

  // Handle filter change
  const handleFilterChange = (filters) => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchApartments(filters);
  };

  // Handle search
  const handleSearch = (searchTerm) => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchApartments({ search: searchTerm });
  };

  // Handle favorite toggle
  const handleFavoriteToggle = async (apartmentId) => {
    if (!isAuthenticated) {
      toast.error('Silakan login terlebih dahulu');
      return;
    }

    try {
      await apartmentsAPI.toggleFavorite(apartmentId);
      
      setFavorites(prev => {
        if (prev.includes(apartmentId)) {
          return prev.filter(id => id !== apartmentId);
        } else {
          return [...prev, apartmentId];
        }
      });

      toast.success(
        favorites.includes(apartmentId)
          ? 'Dihapus dari favorit'
          : 'Ditambahkan ke favorit'
      );
    } catch (error) {
      toast.error('Gagal mengubah favorit');
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Cari Apartemen Impian Anda
          </h1>
          <p className="text-gray-600">
            {pagination.total > 0
              ? `Ditemukan ${pagination.total} unit apartemen`
              : 'Temukan apartemen yang sesuai dengan kebutuhan Anda'}
          </p>
        </div>

        {/* Filters */}
        <ApartmentFilters
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />

        {/* Loading State */}
        {loading ? (
          <Loading text="Memuat apartemen..." />
        ) : (
          <>
            {/* Apartments Grid */}
            {apartments.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {apartments.map((apartment) => (
                    <ApartmentCard
                      key={apartment.id}
                      apartment={apartment}
                      isFavorite={favorites.includes(apartment.id)}
                      onFavoriteToggle={handleFavoriteToggle}
                      showFavorite={isAuthenticated}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.pages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="mx-auto h-16 w-16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Tidak Ada Apartemen Ditemukan
                </h3>
                <p className="text-gray-600">
                  Coba ubah filter pencarian Anda
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ApartmentList;