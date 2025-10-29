import React, { useState } from 'react';
import { 
  BanknotesIcon, 
  CreditCardIcon, 
  DevicePhoneMobileIcon 
} from '@heroicons/react/24/outline';

const PaymentMethod = ({ onSelect, selected }) => {
  const paymentMethods = [
    {
      id: 'bank_transfer',
      name: 'Transfer Bank',
      icon: BanknotesIcon,
      description: 'Transfer melalui ATM atau m-banking'
    },
    {
      id: 'credit_card',
      name: 'Kartu Kredit/Debit',
      icon: CreditCardIcon,
      description: 'Visa, Mastercard, JCB'
    },
    {
      id: 'e_wallet',
      name: 'E-Wallet',
      icon: DevicePhoneMobileIcon,
      description: 'GoPay, OVO, Dana, LinkAja'
    }
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold mb-4">Pilih Metode Pembayaran</h3>
      
      {paymentMethods.map((method) => (
        <button
          key={method.id}
          onClick={() => onSelect(method.id)}
          className={`w-full flex items-center p-4 border-2 rounded-lg transition-colors ${
            selected === method.id
              ? 'border-purple-600 bg-purple-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            selected === method.id ? 'bg-purple-600' : 'bg-gray-100'
          }`}>
            <method.icon className={`h-6 w-6 ${
              selected === method.id ? 'text-white' : 'text-gray-600'
            }`} />
          </div>
          
          <div className="ml-4 text-left flex-1">
            <p className="font-medium text-gray-900">{method.name}</p>
            <p className="text-sm text-gray-500">{method.description}</p>
          </div>
          
          {selected === method.id && (
            <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default PaymentMethod;