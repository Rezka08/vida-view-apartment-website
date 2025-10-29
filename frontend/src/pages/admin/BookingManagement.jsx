import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { MagnifyingGlassIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import bookingsAPI from '../../api/bookings';
import BookingCard from '../../components/booking/BookingCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import Loading from '../../components/common/Loading';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, per_page: 10, total: 0, pages: 0 });
  const [filters, setFilters] = useState({ search: '', status: '' });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [pagination.page, filters]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = { page: pagination.page, per_page: pagination.per_page, ...filters };
      const response = await bookingsAPI.getBookings(params);
      setBookings(response.bookings);
      setPagination(response.pagination);
    } catch (error) {
      toast.error('Gagal memuat data booking');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    setSubmitting(true);
    try {
      if (actionType === 'approve') {
        await bookingsAPI.approveBooking(selectedBooking.id);
        toast.success('Booking berhasil disetujui');
      } else if (actionType === 'reject') {
        await bookingsAPI.rejectBooking(selectedBooking.id, reason);
        toast.success('Booking ditolak');
      }
      setShowActionModal(false);
      fetchBookings();
    } catch (error) {
      toast.error('Gagal memproses booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && bookings.length === 0) return <Loading fullScreen text="Memuat booking..." />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Manajemen Booking</h1>

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <input
              type="text"
              placeholder="Cari kode booking atau unit..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Semua Status</option>
            <option value="pending">Menunggu</option>
            <option value="confirmed">Dikonfirmasi</option>
            <option value="active">Aktif</option>
            <option value="completed">Selesai</option>
            <option value="cancelled">Dibatalkan</option>
          </select>
        </div>
      </div>

      {bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-md p-6">
              <BookingCard booking={booking} />
              {booking.status === 'pending' && (
                <div className="flex space-x-2 mt-4 pt-4 border-t">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setSelectedBooking(booking);
                      setActionType('approve');
                      setShowActionModal(true);
                    }}
                  >
                    <CheckIcon className="h-4 w-4 mr-1" />
                    Setujui
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setSelectedBooking(booking);
                      setActionType('reject');
                      setShowActionModal(true);
                    }}
                  >
                    <XMarkIcon className="h-4 w-4 mr-1" />
                    Tolak
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-600">Tidak ada data booking</p>
        </div>
      )}

      {pagination.pages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
        />
      )}

      <Modal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        title={actionType === 'approve' ? 'Setujui Booking' : 'Tolak Booking'}
      >
        <div className="space-y-4">
          <p>
            {actionType === 'approve' 
              ? `Setujui booking ${selectedBooking?.booking_code}?`
              : `Tolak booking ${selectedBooking?.booking_code}?`
            }
          </p>
          {actionType === 'reject' && (
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Alasan penolakan..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          )}
          <div className="flex space-x-3">
            <Button variant="secondary" onClick={() => setShowActionModal(false)} fullWidth>
              Batal
            </Button>
            <Button onClick={handleAction} loading={submitting} fullWidth>
              {actionType === 'approve' ? 'Setujui' : 'Tolak'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BookingManagement;