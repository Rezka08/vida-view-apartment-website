import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  BanknotesIcon, 
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  DocumentArrowUpIcon
} from '@heroicons/react/24/outline';
import paymentsAPI from '../../api/payment';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Loading from '../../components/common/Loading';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { getStatusText } from '../../utils/helpers';

const MyPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    payment_method: 'bank_transfer',
    transaction_id: '',
    notes: ''
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, [filter]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await paymentsAPI.getPayments(params);
      setPayments(response.payments);
    } catch (error) {
      toast.error('Gagal memuat data pembayaran');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async () => {
    if (!paymentData.payment_method) {
      toast.error('Pilih metode pembayaran');
      return;
    }

    if (!paymentData.transaction_id) {
      toast.error('Masukkan ID transaksi');
      return;
    }

    setUploading(true);
    try {
      await paymentsAPI.confirmPayment(selectedPayment.id, paymentData);
      toast.success('Pembayaran berhasil dikonfirmasi!');
      setShowPaymentModal(false);
      setPaymentData({ payment_method: 'bank_transfer', transaction_id: '', notes: '' });
      fetchPayments();
    } catch (error) {
      toast.error('Gagal mengkonfirmasi pembayaran');
    } finally {
      setUploading(false);
    }
  };

  const getPaymentIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case 'verifying':
        return <DocumentArrowUpIcon className="h-6 w-6 text-blue-500" />;
      case 'pending':
        return <ClockIcon className="h-6 w-6 text-yellow-500" />;
      case 'failed':
        return <XCircleIcon className="h-6 w-6 text-red-500" />;
      default:
        return <BanknotesIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  const getPaymentTypeText = (type) => {
    const types = {
      deposit: 'Deposit',
      monthly_rent: 'Sewa Bulanan',
      penalty: 'Denda',
      refund: 'Pengembalian',
      utility: 'Utilitas'
    };
    return types[type] || type;
  };

  const filters = [
    { value: 'all', label: 'Semua' },
    { value: 'pending', label: 'Belum Dibayar' },
    { value: 'verifying', label: 'Menunggu Verifikasi' },
    { value: 'completed', label: 'Lunas' },
    { value: 'failed', label: 'Gagal' }
  ];

  if (loading) {
    return <Loading fullScreen text="Memuat pembayaran..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Pembayaran Saya</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total Dibayar</span>
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(
              payments
                .filter(p => p.payment_status === 'completed')
                .reduce((sum, p) => sum + parseFloat(p.amount), 0)
            )}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Belum Dibayar</span>
            <ClockIcon className="h-8 w-8 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(
              payments
                .filter(p => p.payment_status === 'pending')
                .reduce((sum, p) => sum + parseFloat(p.amount), 0)
            )}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total Transaksi</span>
            <BanknotesIcon className="h-8 w-8 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {payments.length}
          </p>
        </div>
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

      {/* Payments List */}
      {payments.length > 0 ? (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="mt-1">
                    {getPaymentIcon(payment.payment_status)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {getPaymentTypeText(payment.payment_type)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Kode: {payment.payment_code}
                    </p>
                  </div>
                </div>
                <Badge status={payment.payment_status}>
                  {getStatusText(payment.payment_status, 'payment')}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Jumlah</p>
                  <p className="text-lg font-bold text-purple-600">
                    {formatCurrency(payment.amount)}
                  </p>
                </div>
                {payment.due_date && (
                  <div>
                    <p className="text-sm text-gray-600">Jatuh Tempo</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(payment.due_date, 'short')}
                    </p>
                  </div>
                )}
                {payment.payment_date && (
                  <div>
                    <p className="text-sm text-gray-600">Tanggal Bayar</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(payment.payment_date, 'short')}
                    </p>
                  </div>
                )}
                {payment.payment_method && (
                  <div>
                    <p className="text-sm text-gray-600">Metode</p>
                    <p className="font-medium text-gray-900 capitalize">
                      {payment.payment_method.replace('_', ' ')}
                    </p>
                  </div>
                )}
              </div>

              {payment.notes && (
                <div className="mb-4 p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Catatan:</p>
                  <p className="text-sm text-gray-900">{payment.notes}</p>
                </div>
              )}

              {payment.payment_status === 'verifying' && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>Status:</strong> Pembayaran Anda sedang diverifikasi oleh owner/admin. Mohon tunggu konfirmasi.
                  </p>
                  {payment.transaction_id && (
                    <p className="text-sm text-blue-800 mt-1">
                      <strong>ID Transaksi:</strong> {payment.transaction_id}
                    </p>
                  )}
                </div>
              )}

              {payment.payment_status === 'pending' && (
                <div className="flex space-x-2">
                  <Button
                    onClick={() => {
                      setSelectedPayment(payment);
                      setShowPaymentModal(true);
                    }}
                    className="flex-1"
                  >
                    <DocumentArrowUpIcon className="h-5 w-5 mr-2" />
                    Bayar Sekarang
                  </Button>
                </div>
              )}

              {payment.payment_status === 'completed' && payment.receipt_file && (
                <Button
                  variant="outline"
                  onClick={() => window.open(payment.receipt_file, '_blank')}
                >
                  Lihat Bukti Pembayaran
                </Button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg">
          <BanknotesIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">Belum ada transaksi pembayaran</p>
        </div>
      )}

      {/* Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Konfirmasi Pembayaran"
        size="lg"
      >
        {selectedPayment && (
          <div className="space-y-4">
            <div className="bg-purple-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Total Pembayaran:</span>
                <span className="text-2xl font-bold text-purple-600">
                  {formatCurrency(selectedPayment.amount)}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {getPaymentTypeText(selectedPayment.payment_type)} - {selectedPayment.payment_code}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Metode Pembayaran
              </label>
              <select
                value={paymentData.payment_method}
                onChange={(e) => setPaymentData(prev => ({ ...prev, payment_method: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="bank_transfer">Transfer Bank</option>
                <option value="credit_card">Kartu Kredit/Debit</option>
                <option value="e_wallet">E-Wallet</option>
              </select>
            </div>

            {paymentData.payment_method === 'bank_transfer' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Informasi Transfer:</h4>
                <div className="space-y-1 text-sm text-blue-800">
                  <p><strong>Bank:</strong> BCA</p>
                  <p><strong>No. Rekening:</strong> 1234567890</p>
                  <p><strong>Atas Nama:</strong> PT Vida View</p>
                  <p className="mt-2 text-xs text-blue-600">
                    * Silakan transfer sesuai nominal di atas dan masukkan ID transaksi
                  </p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID Transaksi / Nomor Referensi
              </label>
              <input
                type="text"
                value={paymentData.transaction_id}
                onChange={(e) => setPaymentData(prev => ({ ...prev, transaction_id: e.target.value }))}
                placeholder="Masukkan ID transaksi"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catatan (Opsional)
              </label>
              <textarea
                value={paymentData.notes}
                onChange={(e) => setPaymentData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Tambahkan catatan..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={() => setShowPaymentModal(false)}
                fullWidth
              >
                Batal
              </Button>
              <Button
                onClick={handlePaymentSubmit}
                loading={uploading}
                fullWidth
              >
                Konfirmasi Pembayaran
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyPayments;