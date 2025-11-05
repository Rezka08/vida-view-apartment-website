import React from 'react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { getStatusText } from '../../utils/helpers';

const BookingDetailModal = ({ isOpen, onClose, booking }) => {
  if (!booking) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detail Booking"
      size="lg"
    >
      <div className="space-y-4">
        {/* Booking Code & Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Kode Booking</p>
            <p className="font-medium text-gray-900">{booking.booking_code}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <Badge status={booking.status}>
              {getStatusText(booking.status, 'booking')}
            </Badge>
          </div>
        </div>

        {/* Tenant Info */}
        {booking.tenant && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-semibold text-gray-900 mb-2">Informasi Penyewa</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Nama</span>
                <span className="font-medium">{booking.tenant.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email</span>
                <span className="font-medium">{booking.tenant.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Telepon</span>
                <span className="font-medium">{booking.tenant.phone || '-'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Unit Info */}
        {booking.apartment && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-semibold text-gray-900 mb-2">Informasi Unit</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Nomor Unit</span>
                <span className="font-medium">{booking.apartment.unit_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tipe</span>
                <span className="font-medium">{booking.apartment.unit_type}</span>
              </div>
              {booking.apartment.size_sqm && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Ukuran</span>
                  <span className="font-medium">{booking.apartment.size_sqm} m²</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Booking Period */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="font-semibold text-gray-900 mb-2">Periode Sewa</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Tanggal Mulai</span>
              <span className="font-medium">{formatDate(booking.start_date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tanggal Selesai</span>
              <span className="font-medium">{formatDate(booking.end_date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Durasi</span>
              <span className="font-medium">{booking.total_months} Bulan</span>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="font-semibold text-gray-900 mb-2">Detail Pembayaran</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Sewa Bulanan</span>
              <span className="font-medium">{formatCurrency(booking.monthly_rent)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Durasi</span>
              <span className="font-medium">{booking.total_months} Bulan</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Deposit</span>
              <span className="font-medium">{formatCurrency(booking.deposit_paid || booking.deposit_amount || 0)}</span>
            </div>
            {booking.utility_deposit !== undefined && (
              <div className="flex justify-between">
                <span className="text-gray-600">Deposit Utilitas</span>
                <span className="font-medium">{formatCurrency(booking.utility_deposit)}</span>
              </div>
            )}
            {booking.admin_fee !== undefined && (
              <div className="flex justify-between">
                <span className="text-gray-600">Biaya Admin</span>
                <span className="font-medium">{formatCurrency(booking.admin_fee)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t font-semibold">
              <span className="text-gray-900">Total</span>
              <span className="text-purple-600">{formatCurrency(booking.total_amount)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {booking.notes && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-semibold text-gray-900 mb-2">Catatan</h4>
            <p className="text-gray-600">{booking.notes}</p>
          </div>
        )}

        {/* Rejection Reason */}
        {booking.rejection_reason && (
          <div className="border-t border-gray-200 pt-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <h4 className="font-semibold text-red-900 mb-1">Alasan Penolakan</h4>
              <p className="text-red-800">{booking.rejection_reason}</p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default BookingDetailModal;
