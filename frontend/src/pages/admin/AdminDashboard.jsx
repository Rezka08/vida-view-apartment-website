import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  UsersIcon, 
  BuildingOfficeIcon,
  CalendarIcon,
  BanknotesIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import adminAPI from '../../api/admin';
import StatsCard from '../../components/dashboard/StatsCard';
import Chart from '../../components/dashboard/Chart';
import RecentActivity from '../../components/dashboard/RecentActivity';
import Loading from '../../components/common/Loading';
import { formatCurrency } from '../../utils/formatters';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentData, setRecentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [revenueChart, setRevenueChart] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getDashboardStats();
      setStats(response.stats);
      setRecentData(response.recent);

      // Prepare revenue chart data
      const chartData = [];
      const currentMonth = new Date().getMonth();
      for (let i = 5; i >= 0; i--) {
        const month = (currentMonth - i + 12) % 12;
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
        chartData.push({
          label: monthNames[month],
          value: Math.random() * 50000000 + 20000000 // Mock data
        });
      }
      setRevenueChart(chartData);

    } catch (error) {
      toast.error('Gagal memuat data dashboard');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen text="Memuat dashboard..." />;
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Gagal memuat data dashboard</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Dashboard Administrator</h1>
        <p>Kelola seluruh sistem Vida View Apartments</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Pengguna"
          value={stats.users.total}
          icon={UsersIcon}
          subtitle={`${stats.users.tenants} Penyewa, ${stats.users.owners} Pemilik`}
        />
        <StatsCard
          title="Total Unit"
          value={stats.apartments.total}
          icon={BuildingOfficeIcon}
          subtitle={`${stats.apartments.available} Tersedia, ${stats.apartments.occupied} Terisi`}
        />
        <StatsCard
          title="Total Booking"
          value={stats.bookings.total}
          icon={CalendarIcon}
          subtitle={`${stats.bookings.pending} Menunggu, ${stats.bookings.active} Aktif`}
        />
        <StatsCard
          title="Occupancy Rate"
          value={`${stats.occupancy_rate}%`}
          icon={ChartBarIcon}
        />
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Pendapatan Bulan Ini</span>
            <BanknotesIcon className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(stats.revenue.monthly)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Pendapatan Tahun Ini</span>
            <BanknotesIcon className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(stats.revenue.yearly)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Pembayaran Pending</span>
            <ClockIcon className="h-8 w-8 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(stats.revenue.pending)}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/admin/users"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
        >
          <UsersIcon className="h-12 w-12 mx-auto text-purple-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">Kelola Pengguna</h3>
          <p className="text-sm text-gray-500">Manage users & roles</p>
        </Link>

        <Link
          to="/admin/bookings"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
        >
          <CalendarIcon className="h-12 w-12 mx-auto text-purple-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">Kelola Booking</h3>
          <p className="text-sm text-gray-500">Manage all bookings</p>
        </Link>

        <Link
          to="/admin/payments"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
        >
          <BanknotesIcon className="h-12 w-12 mx-auto text-purple-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">Verifikasi Pembayaran</h3>
          <p className="text-sm text-gray-500">Verify payments</p>
        </Link>

        <Link
          to="/admin/reports"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
        >
          <ChartBarIcon className="h-12 w-12 mx-auto text-purple-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">Laporan</h3>
          <p className="text-sm text-gray-500">View reports</p>
        </Link>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Chart
          data={revenueChart}
          title="Pendapatan 6 Bulan Terakhir"
          type="line"
        />

        {/* Recent Bookings */}
        {recentData?.bookings && (
          <RecentActivity
            activities={recentData.bookings.map(booking => ({
              id: booking.id,
              type: 'booking',
              message: `Booking ${booking.booking_code} - Unit ${booking.apartment?.unit_number}`,
              status: booking.status,
              created_at: booking.created_at
            }))}
            title="Booking Terbaru"
          />
        )}
      </div>

      {/* Recent Users and Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        {recentData?.users && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Pengguna Baru</h2>
              <Link
                to="/admin/users"
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Lihat Semua
              </Link>
            </div>
            <div className="space-y-4">
              {recentData.users.map((user) => (
                <div key={user.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-semibold">
                        {user.full_name?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.full_name}</p>
                      <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(user.created_at).toLocaleDateString('id-ID')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Payments */}
        {recentData?.payments && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Pembayaran Terbaru</h2>
              <Link
                to="/admin/payments"
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Lihat Semua
              </Link>
            </div>
            <div className="space-y-4">
              {recentData.payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{payment.payment_code}</p>
                    <p className="text-sm text-gray-500 capitalize">{payment.payment_type.replace('_', ' ')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-purple-600">
                      {formatCurrency(payment.amount)}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      payment.payment_status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {payment.payment_status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;