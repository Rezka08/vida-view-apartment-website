import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, HomeIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import Badge from '../common/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { getStatusText } from '../../utils/helpers';

const BookingCard = ({ booking }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <Link 
            to={`/apartments/${booking.apartment_id}`}
            className="text-lg font-semibold text-gray-900 hover:text-purple-600"
          >
            Unit {booking.apartment?.unit_number}
          </Link>
          <p className="text-sm text-gray-500">Kode: {booking.booking_code}</p>
        </div>
        <Badge status={booking.status}>
          {getStatusText(booking.status, 'booking')}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center space-x-2 text-sm">
          <CalendarIcon className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-gray-600">Mulai</p>
            <p className="font-medium">{formatDate(booking.start_date, 'short')}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          <CalendarIcon className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-gray-600">Selesai</p>
            <p className="font-medium">{formatDate(booking.end_date, 'short')}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          <BanknotesIcon className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-gray-600">Total</p>
            <p className="font-medium text-purple-600">{formatCurrency(booking.total_amount)}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <span className="text-sm text-gray-500">
          {booking.total_months} bulan • {formatCurrency(booking.monthly_rent)}/bulan
        </span>
        <Link
          to={`/my-bookings/${booking.id}`}
          className="text-sm text-purple-600 hover:text-purple-700 font-medium"
        >
          Lihat Detail →
        </Link>
      </div>
    </div>
  );
};

export default BookingCard;