import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import bookingsAPI from '../../api/bookings';
import BookingCard from '../../components/booking/BookingCard';
import BookingDetailModal from '../../components/booking/BookingDetailModal';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import Modal from '../../components/common/Modal';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await bookingsAPI.getBookings(params);
      setBookings(response.bookings);
    } catch (error) {
      toast.error('Gagal memuat booking');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    try {
      await bookingsAPI.cancelBooking(selectedBooking.id);
      toast.success('Booking berhasil dibatalkan');
      setShowCancelModal(false);
      fetchBookings();
    } catch (error) {
      toast.error('Gagal membatalkan booking');
    }
  };

  const filters = [
    { value: 'all', label: 'Semua' },
    { value: 'pending', label: 'Menunggu' },
    { value: 'confirmed', label: 'Dikonfirmasi' },
    { value: 'active', label: 'Aktif' },
    { value: 'completed', label: 'Selesai' },
    { value: 'cancelled', label: 'Dibatalkan' }
  ];

  if (loading) {
    return <Loading fullScreen text="Memuat booking..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Booking Saya</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.value
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="relative">
              <BookingCard booking={booking} onViewDetail={handleViewDetail} />
              {booking.status === 'pending' && (
                <div className="absolute top-4 right-4">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setSelectedBooking(booking);
                      setShowCancelModal(true);
                    }}
                  >
                    Batalkan
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg">
          <p className="text-gray-600 mb-4">Belum ada booking</p>
          <Button onClick={() => window.location.href = '/apartments'}>
            Cari Apartemen
          </Button>
        </div>
      )}

      {/* Detail Modal */}
      <BookingDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        booking={selectedBooking}
      />

      {/* Cancel Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Batalkan Booking"
        footer={
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowCancelModal(false)}
              fullWidth
            >
              Batal
            </Button>
            <Button
              variant="danger"
              onClick={handleCancelBooking}
              fullWidth
            >
              Ya, Batalkan
            </Button>
          </div>
        }
      >
        <p>Apakah Anda yakin ingin membatalkan booking ini?</p>
      </Modal>
    </div>
  );
};

export default MyBookings;