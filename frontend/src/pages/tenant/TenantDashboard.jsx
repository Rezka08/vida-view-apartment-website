import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  HomeIcon, 
  CalendarIcon, 
  BanknotesIcon,
  HeartIcon 
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import bookingsAPI from '../../api/bookings';
import paymentsAPI from '../../api/payment';
import apartmentsAPI from '../../api/apartments';
import StatsCard from '../../components/dashboard/StatsCard';
import BookingCard from '../../components/booking/BookingCard';
import Loading from '../../components/common/Loading';

const TenantDashboard = () => {
  const [stats, setStats] = useState({
    activeBookings: 0,
    pendingPayments: 0,
    favorites: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [upcomingPayments, setUpcomingPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch bookings
      const bookingsResponse = await bookingsAPI.getBookings({ per_page: 5 });
      setRecentBookings(bookingsResponse.bookings);
      
      const activeBookings = bookingsResponse.bookings.filter(
        b => b.status === 'active' || b.status === 'confirmed'
      ).length;

      // Fetch payments
      const paymentsResponse = await paymentsAPI.getPayments({ 
        status: 'pending',
        per_page: 5 
      });
      setUpcomingPayments(paymentsResponse.payments);

      // Fetch favorites
      const favoritesResponse = await apartmentsAPI.getFavorites();

      setStats({
        activeBookings,
        pendingPayments: paymentsResponse.pagination?.total || 0,
        favorites: favoritesResponse.favorites?.length || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Gagal memuat data dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen text="Memuat dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Selamat Datang!</h1>
        <p>Dashboard penyewa Vida View</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Booking Aktif"
          value={stats.activeBookings}
          icon={CalendarIcon}
        />
        <StatsCard
          title="Pembayaran Pending"
          value={stats.pendingPayments}
          icon={BanknotesIcon}
        />
        <StatsCard
          title="Favorit"
          value={stats.favorites}
          icon={HeartIcon}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/apartments"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
        >
          <HomeIcon className="h-12 w-12 mx-auto text-purple-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">Cari Apartemen</h3>
          <p className="text-sm text-gray-500">Temukan unit impian Anda</p>
        </Link>

        <Link
          to="/my-bookings"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
        >
          <CalendarIcon className="h-12 w-12 mx-auto text-purple-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">Booking Saya</h3>
          <p className="text-sm text-gray-500">Kelola booking Anda</p>
        </Link>

        <Link
          to="/my-payments"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
        >
          <BanknotesIcon className="h-12 w-12 mx-auto text-purple-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">Pembayaran</h3>
          <p className="text-sm text-gray-500">Lihat tagihan Anda</p>
        </Link>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Booking Terbaru</h2>
          <Link
            to="/my-bookings"
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            Lihat Semua
          </Link>
        </div>

        {recentBookings.length > 0 ? (
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <CalendarIcon className="h-12 w-12 mx-auto mb-2" />
            <p>Belum ada booking</p>
            <Link
              to="/apartments"
              className="text-purple-600 hover:text-purple-700 text-sm mt-2 inline-block"
            >
              Mulai cari apartemen
            </Link>
          </div>
        )}
      </div>

      {/* Upcoming Payments */}
      {upcomingPayments.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Pembayaran Mendatang</h2>
            <Link
              to="/my-payments"
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              Lihat Semua
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {payment.payment_type === 'deposit' ? 'Deposit' : 'Sewa Bulanan'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Jatuh tempo: {new Date(payment.due_date).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-purple-600">
                    Rp {payment.amount.toLocaleString('id-ID')}
                  </p>
                  <Link
                    to={`/my-payments/${payment.id}`}
                    className="text-sm text-purple-600 hover:text-purple-700"
                  >
                    Bayar Sekarang
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantDashboard;