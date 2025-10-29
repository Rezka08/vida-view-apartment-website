import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import apartmentsAPI from '../../api/apartments';
import ApartmentCard from '../../components/apartment/ApartmentCard';
import Loading from '../../components/common/Loading';

const FavoriteList = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const response = await apartmentsAPI.getFavorites();
      setFavorites(response.favorites);
    } catch (error) {
      toast.error('Gagal memuat favorit');
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async (apartmentId) => {
    try {
      await apartmentsAPI.toggleFavorite(apartmentId);
      setFavorites(prev => prev.filter(fav => fav.apartment_id !== apartmentId));
      toast.success('Dihapus dari favorit');
    } catch (error) {
      toast.error('Gagal mengubah favorit');
    }
  };

  if (loading) {
    return <Loading fullScreen text="Memuat favorit..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Apartemen Favorit Saya</h1>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav) => (
              <ApartmentCard
                key={fav.apartment.id}
                apartment={fav.apartment}
                isFavorite={true}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600 mb-4">Belum ada apartemen favorit</p>
            <a href="/apartments" className="text-purple-600 hover:text-purple-700">
              Cari Apartemen
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoriteList;