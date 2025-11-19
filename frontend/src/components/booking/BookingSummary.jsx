import React from 'react';
import { TagIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/formatters';

const BookingSummary = ({
  apartment,
  startDate,
  endDate,
  totalMonths,
  monthlyRent,
  deposit,
  utilityDeposit,
  adminFee,
  discount = 0,
  appliedPromo = null,
  total
}) => {
  const subtotal = (monthlyRent * totalMonths) + deposit + utilityDeposit + adminFee;
  const finalTotal = total || subtotal;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
      <h3 className="text-lg font-semibold mb-4">Ringkasan Booking</h3>
      
      {apartment && (
        <div className="mb-4 pb-4 border-b">
          <p className="font-medium text-gray-900">Unit {apartment.unit_number}</p>
          <p className="text-sm text-gray-500">{apartment.unit_type}</p>
        </div>
      )}

      <div className="space-y-3 mb-4 pb-4 border-b">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Periode Sewa</span>
          <span className="font-medium">{totalMonths} bulan</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tanggal Mulai</span>
          <span className="font-medium">{startDate}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tanggal Selesai</span>
          <span className="font-medium">{endDate}</span>
        </div>
      </div>

      <div className="space-y-3 mb-4 pb-4 border-b">
        <div className="flex justify-between">
          <span className="text-gray-600">Sewa {totalMonths} bulan</span>
          <span className="font-medium">{formatCurrency(monthlyRent * totalMonths)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Deposit</span>
          <span className="font-medium">{formatCurrency(deposit)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Deposit Utilitas</span>
          <span className="font-medium">{formatCurrency(utilityDeposit)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Biaya Admin</span>
          <span className="font-medium">{formatCurrency(adminFee)}</span>
        </div>

        {discount > 0 && appliedPromo && (
          <>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <TagIcon className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-xs font-semibold text-green-900">PROMO: {appliedPromo.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-green-700">Diskon</span>
                <span className="font-bold text-green-600">-{formatCurrency(discount)}</span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-between text-lg font-bold">
        <span>Total Pembayaran</span>
        <span className="text-purple-600">{formatCurrency(finalTotal)}</span>
      </div>

      {discount > 0 && (
        <div className="mt-2 text-center">
          <p className="text-sm text-green-600 font-medium">
            Anda hemat {formatCurrency(discount)}!
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingSummary;