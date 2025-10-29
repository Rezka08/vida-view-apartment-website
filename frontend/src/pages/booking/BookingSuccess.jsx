import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import Button from '../../components/common/Button';

const BookingSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingCode = searchParams.get('code');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Booking Berhasil!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Terima kasih! Booking Anda telah berhasil dibuat dan menunggu konfirmasi dari pemilik.
        </p>

        {bookingCode && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Kode Booking:</p>
            <p className="text-xl font-bold text-purple-600">{bookingCode}</p>
          </div>
        )}

        <div className="space-y-3">
          <Button
            fullWidth
            onClick={() => navigate('/my-bookings')}
          >
            Lihat Booking Saya
          </Button>
          
          <Button
            fullWidth
            variant="outline"
            onClick={() => navigate('/apartments')}
          >
            Kembali ke Beranda
          </Button>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>Anda akan menerima notifikasi setelah pemilik mengkonfirmasi booking Anda.</p>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;