import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  MagnifyingGlassIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import bookingsAPI from '../../api/bookings';
import BookingDetailModal from '../../components/booking/BookingDetailModal';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import Loading from '../../components/common/Loading';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { getStatusText } from '../../utils/helpers';

const UnitBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    pages: 0
  });
  
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    apartment_id: ''
  });

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState(''); // 'approve' or 'reject'
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchBookings();
  }, [pagination.page, filters]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        per_page: pagination.per_page,
        ...filters
      };
      const response = await bookingsAPI.getBookings(params);
      setBookings(response.bookings);
      setPagination(response.pagination);
    } catch (error) {
      toast.error('Gagal memuat data booking');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleApproveBooking = async () => {
    if (!selectedBooking) return;

    setActionLoading(true);
    try {
      await bookingsAPI.approveBooking(selectedBooking.id);
      toast.success('Booking berhasil disetujui!');
      setShowActionModal(false);
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menyetujui booking');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectBooking = async () => {
    if (!selectedBooking) return;

    if (!rejectionReason.trim()) {
      toast.error('Masukkan alasan penolakan');
      return;
    }

    setActionLoading(true);
    try {
      await bookingsAPI.rejectBooking(selectedBooking.id, rejectionReason);
      toast.success('Booking ditolak');
      setShowActionModal(false);
      setRejectionReason('');
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menolak booking');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAction = (booking, type) => {
    setSelectedBooking(booking);
    setActionType(type);
    setShowActionModal(true);
  };

  const handleViewDetail = (booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const statusFilters = [
    { value: '', label: 'Semua Status' },
    { value: 'pending', label: 'Menunggu' },
    { value: 'confirmed', label: 'Dikonfirmasi' },
    { value: 'active', label: 'Aktif' },
    { value: 'completed', label: 'Selesai' },
    { value: 'cancelled', label: 'Dibatalkan' },
    { value: 'rejected', label: 'Ditolak' }
  ];

  if (loading && bookings.length === 0) {
    return <Loading fullScreen text="Memuat booking..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Booking Unit</h1>
          <p className="text-gray-600">Kelola semua booking di unit Anda</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total Booking</span>
            <CalendarIcon className="h-8 w-8 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{pagination.total}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Menunggu</span>
            <CalendarIcon className="h-8 w-8 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {bookings.filter(b => b.status === 'pending').length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Aktif</span>
            <CalendarIcon className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {bookings.filter(b => b.status === 'active').length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Selesai</span>
            <CalendarIcon className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {bookings.filter(b => b.status === 'completed').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Cari kode booking, nama penyewa, atau unit..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {statusFilters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bookings List */}
      {bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {booking.tenant?.full_name || 'Unknown Tenant'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {booking.booking_code} • Unit {booking.apartment?.unit_number}
                    </p>
                  </div>
                </div>
                <Badge status={booking.status}>
                  {getStatusText(booking.status, 'booking')}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Tanggal Mulai</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(booking.start_date, 'short')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tanggal Selesai</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(booking.end_date, 'short')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Durasi</p>
                  <p className="font-medium text-gray-900">
                    {booking.total_months} Bulan
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="font-medium text-purple-600">
                    {formatCurrency(booking.total_amount)}
                  </p>
                </div>
              </div>

              {booking.notes && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Catatan:</p>
                  <p className="text-sm text-gray-900">{booking.notes}</p>
                </div>
              )}

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetail(booking)}
                >
                  <EyeIcon className="h-4 w-4 mr-1" />
                  Detail
                </Button>

                {booking.status === 'pending' && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAction(booking, 'approve')}
                    >
                      <CheckIcon className="h-4 w-4 mr-1" />
                      Setujui
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleAction(booking, 'reject')}
                    >
                      <XMarkIcon className="h-4 w-4 mr-1" />
                      Tolak
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg">
          <CalendarIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">Belum ada booking</p>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
        />
      )}

      {/* Detail Modal */}
      <BookingDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        booking={selectedBooking}
      />

      {/* Action Modal */}
      <Modal
        isOpen={showActionModal}
        onClose={() => {
          setShowActionModal(false);
          setRejectionReason('');
        }}
        title={actionType === 'approve' ? 'Setujui Booking' : 'Tolak Booking'}
      >
        {selectedBooking && (
          <div className="space-y-4">
            <p>
              {actionType === 'approve'
                ? `Apakah Anda yakin ingin menyetujui booking ${selectedBooking.booking_code}?`
                : `Apakah Anda yakin ingin menolak booking ${selectedBooking.booking_code}?`
              }
            </p>

            {actionType === 'reject' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alasan Penolakan <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  placeholder="Jelaskan alasan penolakan..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            )}

            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowActionModal(false);
                  setRejectionReason('');
                }}
                fullWidth
              >
                Batal
              </Button>
              <Button
                variant={actionType === 'approve' ? 'primary' : 'danger'}
                onClick={actionType === 'approve' ? handleApproveBooking : handleRejectBooking}
                loading={actionLoading}
                disabled={actionLoading}
                fullWidth
              >
                {actionType === 'approve' ? 'Ya, Setujui' : 'Ya, Tolak'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UnitBookings;