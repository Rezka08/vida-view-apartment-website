import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BuildingOfficeIcon, CalendarIcon, BanknotesIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import adminAPI from '../../api/admin';
import StatsCard from '../../components/dashboard/StatsCard';
import Chart from '../../components/dashboard/Chart';
import Loading from '../../components/common/Loading';
import { formatCurrency } from '../../utils/formatters';

const OwnerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [apartments, setApartments] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getOwnerDashboard();
      setStats(response.stats);
      setApartments(response.apartments);
      setRecentBookings(response.recent_bookings);
    } catch (error) {
      toast.error('Gagal memuat data dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading fullScreen text="Memuat dashboard..." />;
  if (!stats) return <div className="text-center py-12">Gagal memuat data</div>;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Dashboard Pemilik</h1>
        <p>Kelola unit apartemen Anda</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Unit"
          value={stats.apartments.total}
          icon={BuildingOfficeIcon}
          subtitle={`${stats.apartments.available} Tersedia`}
        />
        <StatsCard
          title="Unit Terisi"
          value={stats.apartments.occupied}
          icon={BuildingOfficeIcon}
        />
        <StatsCard
          title="Total Booking"
          value={stats.bookings.total}
          icon={CalendarIcon}
          subtitle={`${stats.bookings.pending} Pending`}
        />
        <StatsCard
          title="Occupancy Rate"
          value={`${stats.occupancy_rate}%`}
          icon={ChartBarIcon}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Pendapatan Bulan Ini</span>
            <BanknotesIcon className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.revenue.monthly)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Pendapatan Tahun Ini</span>
            <BanknotesIcon className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.revenue.yearly)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/owner/apartments" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center">
          <BuildingOfficeIcon className="h-12 w-12 mx-auto text-purple-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">Kelola Unit</h3>
          <p className="text-sm text-gray-500">Manage your units</p>
        </Link>
        <Link to="/owner/bookings" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center">
          <CalendarIcon className="h-12 w-12 mx-auto text-purple-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">Booking</h3>
          <p className="text-sm text-gray-500">View all bookings</p>
        </Link>
        <Link to="/owner/reports" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center">
          <ChartBarIcon className="h-12 w-12 mx-auto text-purple-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">Laporan Keuangan</h3>
          <p className="text-sm text-gray-500">Financial reports</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Unit Saya</h2>
            <Link to="/owner/apartments" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
              Lihat Semua
            </Link>
          </div>
          <div className="space-y-3">
            {apartments.slice(0, 5).map((apt) => (
              <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Unit {apt.unit_number}</p>
                  <p className="text-sm text-gray-500">{apt.unit_type}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  apt.availability_status === 'available' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {apt.availability_status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Booking Terbaru</h2>
            <Link to="/owner/bookings" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
              Lihat Semua
            </Link>
          </div>
          <div className="space-y-3">
            {recentBookings.slice(0, 5).map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{booking.booking_code}</p>
                  <p className="text-sm text-gray-500">Unit {booking.apartment?.unit_number}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  booking.status === 'active' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;