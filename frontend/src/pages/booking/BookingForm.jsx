import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { TagIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import apartmentsAPI from '../../api/apartments';
import bookingsAPI from '../../api/bookings';
import promotionsAPI from '../../api/promotions';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import BookingSummary from '../../components/booking/BookingSummary';
import Loading from '../../components/common/Loading';
import { calculateMonths } from '../../utils/helpers';

const BookingForm = () => {
  const { apartmentId } = useParams();
  const navigate = useNavigate();
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    notes: ''
  });
  const [calculatedData, setCalculatedData] = useState(null);

  // Promo code states
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [validatingPromo, setValidatingPromo] = useState(false);

  useEffect(() => {
    fetchApartment();
  }, [apartmentId]);

  useEffect(() => {
    if (formData.start_date && formData.end_date && apartment) {
      calculateBooking();
    }
  }, [formData.start_date, formData.end_date, apartment, appliedPromo]);

  const fetchApartment = async () => {
    try {
      const data = await apartmentsAPI.getApartment(apartmentId);
      setApartment(data);
      
      if (data.availability_status !== 'available') {
        toast.error('Apartemen tidak tersedia');
        navigate('/apartments');
      }
    } catch (error) {
      toast.error('Gagal memuat data apartemen');
      navigate('/apartments');
    } finally {
      setLoading(false);
    }
  };

  const calculateBooking = () => {
    const totalMonths = calculateMonths(formData.start_date, formData.end_date);

    if (totalMonths < apartment.minimum_stay_months) {
      toast.error(`Minimum sewa ${apartment.minimum_stay_months} bulan`);
      return;
    }

    const monthlyRent = apartment.price_per_month;
    const deposit = apartment.deposit_amount || monthlyRent;
    const utilityDeposit = monthlyRent * 0.2;
    const adminFee = 500000;

    // Calculate subtotal before discount
    const subtotal = (monthlyRent * totalMonths) + deposit + utilityDeposit + adminFee;

    // Calculate discount if promo is applied
    let discount = 0;
    if (appliedPromo) {
      if (appliedPromo.type === 'percent') {
        discount = subtotal * (appliedPromo.value / 100);
      } else if (appliedPromo.type === 'fixed_amount') {
        discount = appliedPromo.value;
      }
    }

    setCalculatedData({
      totalMonths,
      monthlyRent,
      deposit,
      utilityDeposit,
      adminFee,
      subtotal,
      discount,
      total: subtotal - discount
    });
  };

  const handleValidatePromo = async () => {
    if (!promoCode.trim()) {
      toast.error('Masukkan kode promosi');
      return;
    }

    setValidatingPromo(true);
    try {
      const response = await promotionsAPI.validatePromoCode(promoCode.toUpperCase());

      if (response.valid) {
        setAppliedPromo(response.promotion);
        toast.success(`Kode promosi "${response.promotion.code}" berhasil diterapkan!`);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error('Kode promosi tidak valid');
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message || 'Kode promosi tidak dapat digunakan');
      } else {
        toast.error('Gagal memvalidasi kode promosi');
      }
      setAppliedPromo(null);
    } finally {
      setValidatingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setPromoCode('');
    setAppliedPromo(null);
    toast.success('Kode promosi dihapus');
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!calculatedData) {
      toast.error('Mohon pilih tanggal yang valid');
      return;
    }

    setSubmitting(true);

    try {
      const bookingData = {
        apartment_id: parseInt(apartmentId),
        ...formData,
        utility_deposit: calculatedData.utilityDeposit,
        admin_fee: calculatedData.adminFee,
        promotion_id: appliedPromo ? appliedPromo.id : null
      };

      const response = await bookingsAPI.createBooking(bookingData);
      toast.success('Booking berhasil dibuat!');
      navigate(`/booking/${response.booking.id}/payment`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal membuat booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading fullScreen text="Memuat..." />;
  }

  if (!apartment) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(`/apartments/${apartmentId}`)}
          className="mb-4 text-purple-600 hover:text-purple-700"
        >
          ← Kembali ke Detail Unit
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Booking Unit {apartment.unit_number}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Tanggal Mulai"
                  name="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />

                <Input
                  label="Tanggal Selesai"
                  name="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={handleChange}
                  required
                  min={formData.start_date}
                />
              </div>

              {/* Promo Code Section */}
              {calculatedData && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <TagIcon className="h-5 w-5 text-purple-600 mr-2" />
                    <h3 className="font-semibold text-gray-900">Kode Promosi</h3>
                  </div>

                  {!appliedPromo ? (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        placeholder="Masukkan kode promosi"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        disabled={validatingPromo}
                      />
                      <Button
                        type="button"
                        onClick={handleValidatePromo}
                        loading={validatingPromo}
                        disabled={!promoCode.trim() || validatingPromo}
                      >
                        Terapkan
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                          <div>
                            <p className="font-semibold text-green-900">{appliedPromo.code}</p>
                            <p className="text-sm text-green-700">{appliedPromo.title}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemovePromo}
                          className="text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <Input
                label="Catatan (Opsional)"
                name="notes"
                type="textarea"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Tambahkan catatan untuk pemilik..."
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Informasi Penting:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Minimum sewa: {apartment.minimum_stay_months} bulan</li>
                  <li>• Deposit akan dikembalikan setelah masa sewa berakhir</li>
                  <li>• Booking akan menunggu konfirmasi dari pemilik</li>
                  <li>• Pembayaran dilakukan setelah booking dikonfirmasi</li>
                </ul>
              </div>

              <Button
                type="submit"
                fullWidth
                size="lg"
                loading={submitting}
                disabled={!calculatedData || submitting}
              >
                Lanjutkan ke Pembayaran
              </Button>
            </form>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            {calculatedData ? (
              <BookingSummary
                apartment={apartment}
                startDate={formData.start_date}
                endDate={formData.end_date}
                totalMonths={calculatedData.totalMonths}
                monthlyRent={calculatedData.monthlyRent}
                deposit={calculatedData.deposit}
                utilityDeposit={calculatedData.utilityDeposit}
                adminFee={calculatedData.adminFee}
                discount={calculatedData.discount}
                appliedPromo={appliedPromo}
                total={calculatedData.total}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                Pilih tanggal untuk melihat ringkasan
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;