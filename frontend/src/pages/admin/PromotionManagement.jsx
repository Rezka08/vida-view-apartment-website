import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  TagIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Loading from '../../components/common/Loading';
import promotionsAPI from '../../api/promotions';
import { formatCurrency, formatDate } from '../../utils/formatters';

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingPromotion, setDeletingPromotion] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    type: 'percent',
    value: '',
    start_date: '',
    end_date: '',
    active: true
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchPromotions();
  }, [filter]);

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await promotionsAPI.getPromotions(params);
      setPromotions(response.promotions || []);
    } catch (error) {
      console.error('Error fetching promotions:', error);
      toast.error('Gagal memuat promosi');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.code.trim()) newErrors.code = 'Kode promosi harus diisi';
    if (formData.code.length > 20) newErrors.code = 'Kode promosi maksimal 20 karakter';
    if (!/^[A-Z0-9_-]+$/.test(formData.code)) newErrors.code = 'Kode hanya boleh huruf kapital, angka, underscore, dan dash';
    if (!formData.title.trim()) newErrors.title = 'Judul harus diisi';
    if (!formData.value || parseFloat(formData.value) <= 0) newErrors.value = 'Nilai diskon harus lebih dari 0';
    if (formData.type === 'percent' && parseFloat(formData.value) > 100) newErrors.value = 'Persentase maksimal 100%';
    if (!formData.start_date) newErrors.start_date = 'Tanggal mulai harus diisi';
    if (!formData.end_date) newErrors.end_date = 'Tanggal selesai harus diisi';
    if (formData.start_date && formData.end_date && new Date(formData.end_date) < new Date(formData.start_date)) {
      newErrors.end_date = 'Tanggal selesai harus setelah tanggal mulai';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    setSubmitting(true);
    try {
      const submitData = {
        code: formData.code.toUpperCase(),
        title: formData.title,
        description: formData.description,
        type: formData.type,
        value: parseFloat(formData.value),
        start_date: formData.start_date,
        end_date: formData.end_date,
        active: formData.active
      };

      if (editingPromotion) {
        await promotionsAPI.updatePromotion(editingPromotion.id, submitData);
        toast.success('Promosi berhasil diperbarui!');
      } else {
        await promotionsAPI.createPromotion(submitData);
        toast.success('Promosi berhasil dibuat!');
      }

      setShowModal(false);
      resetForm();
      fetchPromotions();
    } catch (error) {
      console.error('Error submitting promotion:', error);
      toast.error(error.response?.data?.message || 'Gagal menyimpan promosi');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      code: promotion.code || '',
      title: promotion.title || '',
      description: promotion.description || '',
      type: promotion.type || 'percent',
      value: promotion.value || '',
      start_date: promotion.start_date || '',
      end_date: promotion.end_date || '',
      active: promotion.active !== undefined ? promotion.active : true
    });
    setErrors({});
    setShowModal(true);
  };

  const handleDeleteClick = (promotion) => {
    setDeletingPromotion(promotion);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await promotionsAPI.deletePromotion(deletingPromotion.id);
      toast.success('Promosi berhasil dihapus!');
      setShowDeleteModal(false);
      fetchPromotions();
    } catch (error) {
      console.error('Error deleting promotion:', error);
      toast.error('Gagal menghapus promosi');
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      title: '',
      description: '',
      type: 'percent',
      value: '',
      start_date: '',
      end_date: '',
      active: true
    });
    setEditingPromotion(null);
    setErrors({});
  };

  const getTypeLabel = (type) => {
    const types = {
      percent: 'Persentase',
      fixed_amount: 'Nominal Tetap',
      seasonal: 'Musiman',
      coupon: 'Kupon',
      special_rate: 'Rate Khusus'
    };
    return types[type] || type;
  };

  const getDiscountDisplay = (promotion) => {
    if (promotion.type === 'percent') {
      return `${promotion.value}%`;
    }
    return formatCurrency(promotion.value);
  };

  const isPromotionActive = (promotion) => {
    if (!promotion.active) return false;
    const today = new Date();
    const startDate = new Date(promotion.start_date);
    const endDate = new Date(promotion.end_date);
    return today >= startDate && today <= endDate;
  };

  if (loading) {
    return <Loading fullScreen text="Memuat promosi..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Promosi</h1>
        <Button onClick={() => { resetForm(); setShowModal(true); }}>
          <PlusIcon className="h-5 w-5 mr-2" />
          Tambah Promosi
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total Promosi</span>
            <TagIcon className="h-8 w-8 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{promotions.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Aktif</span>
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {promotions.filter(p => isPromotionActive(p)).length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Tidak Aktif</span>
            <XCircleIcon className="h-8 w-8 text-gray-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {promotions.filter(p => !isPromotionActive(p)).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        {['all', 'active', 'inactive'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {f === 'all' ? 'Semua' : f === 'active' ? 'Aktif' : 'Tidak Aktif'}
          </button>
        ))}
      </div>

      {/* Promotions List */}
      {promotions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promotion) => (
            <div
              key={promotion.id}
              className="relative bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
            >
              {/* Status Badge - Fixed Position Top Right */}
              <div className="absolute top-4 right-4 z-10">
                <Badge status={isPromotionActive(promotion) ? 'confirmed' : 'cancelled'}>
                  {isPromotionActive(promotion) ? 'Aktif' : 'Tidak Aktif'}
                </Badge>
              </div>

              {/* Gradient Header */}
              <div className={`h-2 ${isPromotionActive(promotion) ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-gray-400 to-gray-500'}`}></div>

              {/* Card Content */}
              <div className="p-6 flex flex-col flex-1">
                {/* Title and Description - Fixed Height Area */}
                <div className="mb-4 min-h-[100px]">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 pr-20 line-clamp-2">
                    {promotion.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">
                    {promotion.description || 'Tidak ada deskripsi'}
                  </p>
                </div>

                {/* Promo Code Highlight */}
                <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <p className="text-xs text-gray-600 mb-1">Kode Promosi</p>
                  <p className="font-mono font-bold text-purple-600 text-lg tracking-wide">
                    {promotion.code}
                  </p>
                </div>

                {/* Promotion Details */}
                <div className="space-y-3 mb-4 flex-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <TagIcon className="h-4 w-4 mr-1" />
                      Tipe
                    </span>
                    <span className="font-medium bg-gray-100 px-2 py-1 rounded">
                      {getTypeLabel(promotion.type)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Diskon</span>
                    <span className="font-bold text-2xl text-green-600">
                      {getDiscountDisplay(promotion)}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center text-xs text-gray-600 mb-1">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      Periode Promosi
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-semibold text-gray-900">{formatDate(promotion.start_date, 'short')}</p>
                      </div>
                      <div className="text-gray-400">→</div>
                      <div>
                        <p className="font-semibold text-gray-900">{formatDate(promotion.end_date, 'short')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons - Fixed at Bottom */}
                <div className="flex space-x-2 mt-auto pt-4 border-t border-gray-100">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(promotion)}
                    fullWidth
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDeleteClick(promotion)}
                    fullWidth
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Hapus
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <TagIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">Belum ada promosi</p>
          <Button onClick={() => { resetForm(); setShowModal(true); }}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Tambah Promosi Pertama
          </Button>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingPromotion ? 'Edit Promosi' : 'Tambah Promosi'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Kode Promosi"
            value={formData.code}
            onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
            error={errors.code}
            placeholder="Contoh: LEBARAN2025"
            maxLength={20}
            required
          />

          <Input
            label="Judul Promosi"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            error={errors.title}
            placeholder="Contoh: Diskon Spesial Ramadan"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Deskripsi promosi..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipe Diskon <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="percent">Persentase</option>
                <option value="fixed_amount">Nominal Tetap</option>
              </select>
            </div>

            <Input
              label="Nilai Diskon"
              type="number"
              value={formData.value}
              onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
              error={errors.value}
              placeholder={formData.type === 'percent' ? '10' : '1000000'}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Tanggal Mulai"
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
              error={errors.start_date}
              required
            />
            <Input
              label="Tanggal Selesai"
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
              error={errors.end_date}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
              className="rounded text-purple-600 focus:ring-purple-500"
            />
            <label className="text-sm font-medium text-gray-700">
              Promosi Aktif
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowModal(false)}
              fullWidth
            >
              Batal
            </Button>
            <Button
              type="submit"
              loading={submitting}
              fullWidth
            >
              {editingPromotion ? 'Perbarui' : 'Tambah'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Hapus Promosi"
      >
        <div className="mb-4">
          <p className="mb-2">
            Apakah Anda yakin ingin menghapus promosi <strong>{deletingPromotion?.title}</strong>?
          </p>
          <p className="text-sm text-gray-600">
            Aksi ini tidak dapat dibatalkan.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} fullWidth>
            Batal
          </Button>
          <Button variant="danger" onClick={handleDelete} fullWidth>
            Ya, Hapus
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default PromotionManagement;
