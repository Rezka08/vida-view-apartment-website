import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { CheckCircleIcon, XCircleIcon, EyeIcon } from '@heroicons/react/24/outline';
import paymentsAPI from '../../api/payment';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import Loading from '../../components/common/Loading';
import { formatCurrency, formatDate } from '../../utils/formatters';

const PaymentVerification = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, per_page: 10, total: 0, pages: 0 });
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, [pagination.page]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await paymentsAPI.getPayments({ 
        page: pagination.page, 
        per_page: pagination.per_page,
        status: 'pending'
      });
      setPayments(response.payments);
      setPagination(response.pagination);
    } catch (error) {
      toast.error('Gagal memuat data pembayaran');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (approve) => {
    setSubmitting(true);
    try {
      await paymentsAPI.verifyPayment(selectedPayment.id, { 
        approved: approve, 
        notes: notes 
      });
      toast.success(approve ? 'Pembayaran diverifikasi' : 'Pembayaran ditolak');
      setShowModal(false);
      fetchPayments();
    } catch (error) {
      toast.error('Gagal memverifikasi pembayaran');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && payments.length === 0) return <Loading fullScreen text="Memuat pembayaran..." />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Verifikasi Pembayaran</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kode</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Metode</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{payment.payment_code}</div>
                  <div className="text-sm text-gray-500">{payment.payment_type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {payment.booking?.booking_code || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-purple-600">
                    {formatCurrency(payment.amount)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(payment.created_at, 'short')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                  {payment.payment_method?.replace('_', ' ') || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        setSelectedPayment(payment);
                        setAction('view');
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPayment(payment);
                        setAction('approve');
                        setShowModal(true);
                      }}
                      className="text-green-600 hover:text-green-900"
                    >
                      <CheckCircleIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPayment(payment);
                        setAction('reject');
                        setShowModal(true);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      <XCircleIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {payments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">Tidak ada pembayaran yang perlu diverifikasi</p>
          </div>
        )}
      </div>

      {pagination.pages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
        />
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={action === 'approve' ? 'Verifikasi Pembayaran' : action === 'reject' ? 'Tolak Pembayaran' : 'Detail Pembayaran'}
      >
        {selectedPayment && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Kode Pembayaran</p>
                  <p className="font-medium">{selectedPayment.payment_code}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Jumlah</p>
                  <p className="font-bold text-purple-600">{formatCurrency(selectedPayment.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Metode</p>
                  <p className="font-medium capitalize">{selectedPayment.payment_method?.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">ID Transaksi</p>
                  <p className="font-medium">{selectedPayment.transaction_id || '-'}</p>
                </div>
              </div>
            </div>

            {action !== 'view' && (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Catatan (opsional)..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            )}

            <div className="flex space-x-3">
              <Button variant="secondary" onClick={() => setShowModal(false)} fullWidth>
                {action === 'view' ? 'Tutup' : 'Batal'}
              </Button>
              {action !== 'view' && (
                <Button
                  variant={action === 'approve' ? 'primary' : 'danger'}
                  onClick={() => handleVerify(action === 'approve')}
                  loading={submitting}
                  fullWidth
                >
                  {action === 'approve' ? 'Verifikasi' : 'Tolak'}
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PaymentVerification;