import React from 'react';
import { formatCurrency } from '../../utils/formatters';

const BookingSummary = ({ 
  apartment, 
  startDate, 
  endDate, 
  totalMonths, 
  monthlyRent,
  deposit,
  utilityDeposit,
  adminFee 
}) => {
  const total = (monthlyRent * totalMonths) + deposit + utilityDeposit + adminFee;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
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
      </div>

      <div className="flex justify-between text-lg font-bold">
        <span>Total Pembayaran</span>
        <span className="text-purple-600">{formatCurrency(total)}</span>
      </div>
    </div>
  );
};

export default BookingSummary;