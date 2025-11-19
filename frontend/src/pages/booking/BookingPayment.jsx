import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  BanknotesIcon,
  CreditCardIcon,
  DevicePhoneMobileIcon,
  DocumentArrowUpIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import bookingsAPI from '../../api/bookings';
import paymentsAPI from '../../api/payment';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import BookingSummary from '../../components/booking/BookingSummary';
import PaymentMethod from '../../components/booking/PaymentMethod';
import Loading from '../../components/common/Loading';
import { formatCurrency, formatDate } from '../../utils/formatters';

const BookingPayment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: Method Selection, 2: Payment Details, 3: Upload Proof
  
  const [paymentData, setPaymentData] = useState({
    payment_method: '',
    transaction_id: '',
    notes: '',
    receipt_file: null
  });

  useEffect(() => {
    fetchBookingAndPayment();
  }, [bookingId]);

  const fetchBookingAndPayment = async () => {
    setLoading(true);
    try {
      const bookingResponse = await bookingsAPI.getBooking(bookingId);
      setBooking(bookingResponse.booking);

      // Check if booking is cancelled or rejected
      if (bookingResponse.booking.status === 'cancelled') {
        toast.error('Booking ini telah dibatalkan');
        navigate('/my-bookings');
        return;
      }

      if (bookingResponse.booking.status === 'rejected') {
        toast.error('Booking ini telah ditolak');
        navigate('/my-bookings');
        return;
      }

      // Get payment for this booking
      const paymentsResponse = await paymentsAPI.getBookingPayments(bookingId);
      if (paymentsResponse.payments && paymentsResponse.payments.length > 0) {
        const pendingPayment = paymentsResponse.payments.find(p => p.payment_status === 'pending');
        setPayment(pendingPayment || paymentsResponse.payments[0]);
      }
    } catch (error) {
      toast.error('Gagal memuat data booking');
      navigate('/my-bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleMethodSelect = (method) => {
    setPaymentData(prev => ({ ...prev, payment_method: method }));
  };

  const handleNextStep = () => {
    if (step === 1 && !paymentData.payment_method) {
      toast.error('Pilih metode pembayaran terlebih dahulu');
      return;
    }
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 5MB');
        return;
      }
      setPaymentData(prev => ({ ...prev, receipt_file: file }));
    }
  };

  const handleSubmitPayment = async () => {
    if (!paymentData.transaction_id) {
      toast.error('Masukkan ID transaksi');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('payment_method', paymentData.payment_method);
      formData.append('transaction_id', paymentData.transaction_id);
      if (paymentData.notes) {
        formData.append('notes', paymentData.notes);
      }
      if (paymentData.receipt_file) {
        formData.append('receipt_file', paymentData.receipt_file);
      }

      await paymentsAPI.confirmPayment(payment.id, formData);
      toast.success('Pembayaran berhasil dikonfirmasi!');
      navigate(`/booking/success?code=${booking.booking_code}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal memproses pembayaran');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading fullScreen text="Memuat data pembayaran..." />;
  }

  if (!booking) {
    return null;
  }

  const getBankInfo = () => {
    return {
      bank_name: 'Bank Central Asia (BCA)',
      account_number: '1234567890',
      account_name: 'PT Vida View Apartments',
      swift_code: 'CENAIDJA'
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((s, index) => (
              <React.Fragment key={s}>
                <div className={`flex items-center ${index > 0 ? 'ml-4' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= s
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > s ? (
                      <CheckCircleIcon className="h-6 w-6" />
                    ) : (
                      <span className="font-semibold">{s}</span>
                    )}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    step >= s ? 'text-purple-600' : 'text-gray-500'
                  }`}>
                    {s === 1 ? 'Pilih Metode' : s === 2 ? 'Detail Pembayaran' : 'Konfirmasi'}
                  </span>
                </div>
                {index < 2 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > s ? 'bg-purple-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card title="Pembayaran Booking" className="mb-6">
              {/* Step 1: Payment Method Selection */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <ClockIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">Selesaikan Pembayaran</h4>
                        <p className="text-sm text-blue-800">
                          Booking Anda akan menunggu konfirmasi dari pemilik setelah pembayaran dikonfirmasi.
                        </p>
                      </div>
                    </div>
                  </div>

                  <PaymentMethod
                    selected={paymentData.payment_method}
                    onSelect={handleMethodSelect}
                  />

                  <div className="flex justify-end">
                    <Button
                      onClick={handleNextStep}
                      disabled={!paymentData.payment_method}
                      size="lg"
                    >
                      Lanjutkan
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Details */}
              {step === 2 && (
                <div className="space-y-6">
                  {paymentData.payment_method === 'bank_transfer' && (
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                      <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                        <BanknotesIcon className="h-6 w-6 mr-2" />
                        Informasi Transfer Bank
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-blue-200">
                          <span className="text-blue-800">Nama Bank:</span>
                          <span className="font-semibold text-blue-900">{getBankInfo().bank_name}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-blue-200">
                          <span className="text-blue-800">Nomor Rekening:</span>
                          <span className="font-semibold text-blue-900 font-mono">{getBankInfo().account_number}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-blue-200">
                          <span className="text-blue-800">Atas Nama:</span>
                          <span className="font-semibold text-blue-900">{getBankInfo().account_name}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-blue-800">SWIFT Code:</span>
                          <span className="font-semibold text-blue-900 font-mono">{getBankInfo().swift_code}</span>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-sm text-yellow-800">
                          <strong>Penting:</strong> Transfer sesuai nominal yang tertera. Simpan bukti transfer untuk proses verifikasi.
                        </p>
                      </div>
                    </div>
                  )}

                  {paymentData.payment_method === 'credit_card' && (
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                      <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                        <CreditCardIcon className="h-6 w-6 mr-2" />
                        Pembayaran Kartu Kredit/Debit
                      </h3>
                      <p className="text-purple-800 mb-4">
                        Anda akan diarahkan ke gateway pembayaran untuk menyelesaikan transaksi.
                      </p>
                      <div className="flex space-x-2">
                        <img src="/images/visa.png" alt="Visa" className="h-8" onError={(e) => e.target.style.display = 'none'} />
                        <img src="/images/mastercard.png" alt="Mastercard" className="h-8" onError={(e) => e.target.style.display = 'none'} />
                        <img src="/images/jcb.png" alt="JCB" className="h-8" onError={(e) => e.target.style.display = 'none'} />
                      </div>
                    </div>
                  )}

                  {paymentData.payment_method === 'e_wallet' && (
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                      <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                        <DevicePhoneMobileIcon className="h-6 w-6 mr-2" />
                        Pembayaran E-Wallet
                      </h3>
                      <p className="text-green-800 mb-4">
                        Pilih e-wallet favorit Anda untuk menyelesaikan pembayaran.
                      </p>
                      <div className="grid grid-cols-4 gap-3">
                        {['GoPay', 'OVO', 'Dana', 'LinkAja'].map((wallet) => (
                          <div key={wallet} className="p-3 bg-white rounded-lg border-2 border-green-200 hover:border-green-500 cursor-pointer text-center transition-colors">
                            <p className="text-sm font-semibold text-green-900">{wallet}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={handlePreviousStep}
                      fullWidth
                    >
                      Kembali
                    </Button>
                    <Button
                      onClick={handleNextStep}
                      fullWidth
                    >
                      Lanjutkan
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Upload Proof */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ID Transaksi / Nomor Referensi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={paymentData.transaction_id}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, transaction_id: e.target.value }))}
                      placeholder="Masukkan ID transaksi atau nomor referensi"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      ID transaksi dapat ditemukan di bukti transfer atau aplikasi perbankan Anda
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Bukti Pembayaran (Opsional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition-colors cursor-pointer">
                      <input
                        type="file"
                        id="receipt-upload"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label htmlFor="receipt-upload" className="cursor-pointer">
                        <DocumentArrowUpIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 mb-1">
                          {paymentData.receipt_file ? (
                            <span className="text-purple-600 font-medium">
                              {paymentData.receipt_file.name}
                            </span>
                          ) : (
                            'Klik untuk upload atau drag and drop'
                          )}
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, PDF (max. 5MB)
                        </p>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catatan (Opsional)
                    </label>
                    <textarea
                      value={paymentData.notes}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                      placeholder="Tambahkan catatan jika diperlukan..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircleIcon className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-green-900 mb-1">Siap untuk Konfirmasi</h4>
                        <p className="text-sm text-green-800">
                          Setelah Anda mengkonfirmasi, pembayaran akan diverifikasi oleh tim kami dalam 1x24 jam.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={handlePreviousStep}
                      fullWidth
                    >
                      Kembali
                    </Button>
                    <Button
                      onClick={handleSubmitPayment}
                      loading={submitting}
                      disabled={!paymentData.transaction_id || submitting}
                      fullWidth
                      size="lg"
                    >
                      Konfirmasi Pembayaran
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            {booking && (
              <BookingSummary
                apartment={booking.apartment}
                startDate={formatDate(booking.start_date, 'short')}
                endDate={formatDate(booking.end_date, 'short')}
                totalMonths={booking.total_months}
                monthlyRent={booking.monthly_rent}
                deposit={booking.deposit_amount}
                utilityDeposit={booking.utility_deposit}
                adminFee={booking.admin_fee}
                discount={booking.discount_amount || 0}
                appliedPromo={booking.promotion}
                total={booking.total_amount}
              />
            )}

            <div className="mt-6 bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Informasi Penting</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Pembayaran akan diverifikasi dalam 1x24 jam</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Simpan bukti transfer untuk keperluan verifikasi</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Hubungi customer service jika ada kendala</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPayment;