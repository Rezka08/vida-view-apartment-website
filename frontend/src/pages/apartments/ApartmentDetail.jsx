import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  MapPinIcon,
  HomeIcon,
  BoltIcon,
  FireIcon,
  TruckIcon,
  HeartIcon as HeartOutline
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import apartmentsAPI from '../../api/apartments';
import { useAuthStore } from '../../stores/authStore';
import ImageGallery from '../../components/apartment/ImageGallery';
import FacilityList from '../../components/apartment/FacilityList';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loading from '../../components/common/Loading';
import { formatCurrency } from '../../utils/formatters';

const ApartmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    fetchApartmentDetail();
  }, [id]);

  const fetchApartmentDetail = async () => {
    setLoading(true);
    try {
      const data = await apartmentsAPI.getApartment(id);
      setApartment(data);
      
      // Check if favorited
      if (isAuthenticated) {
        const favResponse = await apartmentsAPI.getFavorites();
        setIsFavorite(favResponse.favorites.some(fav => fav.apartment_id === parseInt(id)));
      }
    } catch (error) {
      toast.error('Gagal memuat detail apartemen');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Silakan login terlebih dahulu');
      navigate('/login');
      return;
    }

    try {
      await apartmentsAPI.toggleFavorite(id);
      setIsFavorite(!isFavorite);
      toast.success(isFavorite ? 'Dihapus dari favorit' : 'Ditambahkan ke favorit');
    } catch (error) {
      toast.error('Gagal mengubah favorit');
    }
  };

  const handleBooking = () => {
    if (!isAuthenticated) {
      toast.error('Silakan login terlebih dahulu');
      navigate('/login');
      return;
    }

    if (user?.role !== 'tenant') {
      toast.error('Hanya penyewa yang dapat melakukan booking');
      return;
    }

    if (apartment.availability_status !== 'available') {
      toast.error('Unit ini tidak tersedia');
      return;
    }

    navigate(`/booking/${id}`);
  };

  const handleContactOwner = () => {
    if (!isAuthenticated) {
      toast.error('Silakan login terlebih dahulu');
      navigate('/login');
      return;
    }
    toast.info('Fitur hubungi pemilik akan segera tersedia');
  };

  if (loading) {
    return <Loading fullScreen text="Memuat detail apartemen..." />;
  }

  if (!apartment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Apartemen Tidak Ditemukan
          </h2>
          <Button onClick={() => navigate('/apartments')}>
            Kembali ke Daftar Apartemen
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/apartments')}
          className="mb-4 text-purple-600 hover:text-purple-700 flex items-center"
        >
          <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <ImageGallery photos={apartment.photos} />
            </div>

            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Unit {apartment.unit_number}
                  </h1>
                  <p className="text-lg text-gray-600">{apartment.unit_type}</p>
                </div>
                <div>
                  <Badge status={apartment.availability_status}>
                    {apartment.availability_status === 'available' ? 'Tersedia' : 'Terisi'}
                  </Badge>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <HomeIcon className="h-6 w-6 mx-auto text-purple-600 mb-2" />
                  <p className="text-sm text-gray-600">Kamar Tidur</p>
                  <p className="text-lg font-semibold">{apartment.bedrooms}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <HomeIcon className="h-6 w-6 mx-auto text-purple-600 mb-2" />
                  <p className="text-sm text-gray-600">Kamar Mandi</p>
                  <p className="text-lg font-semibold">{apartment.bathrooms}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <MapPinIcon className="h-6 w-6 mx-auto text-purple-600 mb-2" />
                  <p className="text-sm text-gray-600">Luas</p>
                  <p className="text-lg font-semibold">{apartment.size_sqm}m²</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <BoltIcon className="h-6 w-6 mx-auto text-purple-600 mb-2" />
                  <p className="text-sm text-gray-600">Lantai</p>
                  <p className="text-lg font-semibold">{apartment.floor}</p>
                </div>
              </div>

              {/* Description */}
              {apartment.description && (
                <div>
                  <h2 className="text-xl font-semibold mb-3">Deskripsi</h2>
                  <p className="text-gray-600 leading-relaxed">{apartment.description}</p>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Detail Unit</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Furnished</span>
                  <span className="font-medium">{apartment.furnished ? 'Ya' : 'Tidak'}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">View Direction</span>
                  <span className="font-medium">{apartment.view_direction || '-'}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Daya Listrik</span>
                  <span className="font-medium">{apartment.electricity_watt || '-'} Watt</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Parkir</span>
                  <span className="font-medium">{apartment.parking_slots || 0} Slot</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Pet Friendly</span>
                  <span className="font-medium">{apartment.pet_friendly ? 'Ya' : 'Tidak'}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Smoking</span>
                  <span className="font-medium">{apartment.smoking_allowed ? 'Diizinkan' : 'Tidak Diizinkan'}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Minimum Sewa</span>
                  <span className="font-medium">{apartment.minimum_stay_months} Bulan</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Deposit</span>
                  <span className="font-medium">{formatCurrency(apartment.deposit_amount)}</span>
                </div>
              </div>
            </div>

            {/* Facilities */}
            {apartment.facilities && apartment.facilities.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Fasilitas</h2>
                <FacilityList facilities={apartment.facilities} />
              </div>
            )}

            {/* Reviews */}
            {apartment.reviews && apartment.reviews.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Ulasan Penyewa</h2>
                <div className="space-y-4">
                  {apartment.reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium">{review.tenant?.full_name}</p>
                          <div className="flex items-center mt-1">
                            {[...Array(review.rating)].map((_, i) => (
                              <span key={i} className="text-yellow-400">★</span>
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                      <p className="text-gray-600">{review.review_text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="mb-6">
                <p className="text-3xl font-bold text-purple-600">
                  {formatCurrency(apartment.price_per_month)}
                </p>
                <p className="text-gray-600">/bulan</p>
              </div>

              {apartment.availability_status === 'available' ? (
                <div className="space-y-3">
                  <Button
                    fullWidth
                    size="lg"
                    onClick={handleBooking}
                  >
                    Booking Sekarang
                  </Button>
                  <Button
                    fullWidth
                    variant="outline"
                    onClick={handleContactOwner}
                  >
                    Hubungi Pemilik
                  </Button>
                  <Button
                    fullWidth
                    variant="ghost"
                    onClick={handleFavoriteToggle}
                  >
                    {isFavorite ? (
                      <>
                        <HeartSolid className="h-5 w-5 mr-2 text-red-500" />
                        Hapus dari Favorit
                      </>
                    ) : (
                      <>
                        <HeartOutline className="h-5 w-5 mr-2" />
                        Tambah ke Favorit
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <p className="text-gray-600">Unit ini sedang tidak tersedia</p>
                </div>
              )}

              {/* Owner Info */}
              {apartment.owner && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold mb-3">Pemilik Unit</h3>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-semibold">
                        {apartment.owner.full_name?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{apartment.owner.full_name}</p>
                      <p className="text-sm text-gray-500">Pemilik</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Dilihat</span>
                  <span className="font-medium">{apartment.total_views}x</span>
                </div>
                {apartment.avg_rating > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Rating</span>
                    <span className="font-medium">
                      ★ {apartment.avg_rating}/5
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApartmentDetail;