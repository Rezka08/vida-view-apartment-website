import { useState } from 'react';
import { toast } from 'react-hot-toast';
import bookingsAPI from '../api/bookings';

const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookings = async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await bookingsAPI.getBookings(params);
      setBookings(response.bookings);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Gagal memuat booking';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData) => {
    setLoading(true);
    try {
      const response = await bookingsAPI.createBooking(bookingData);
      toast.success('Booking berhasil dibuat');
      return response;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal membuat booking');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      await bookingsAPI.cancelBooking(bookingId);
      toast.success('Booking berhasil dibatalkan');
      await fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal membatalkan booking');
      throw err;
    }
  };

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    createBooking,
    cancelBooking
  };
};

export default useBookings;