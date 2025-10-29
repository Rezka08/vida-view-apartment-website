import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    start_date: '',
    end_date: '',
    status: 'active'
  });

  const handleSubmit = () => {
    if (editingPromotion) {
      toast.success('Promosi berhasil diperbarui');
    } else {
      toast.success('Promosi berhasil dibuat');
    }
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      discount_type: 'percentage',
      discount_value: '',
      start_date: '',
      end_date: '',
      status: 'active'
    });
    setEditingPromotion(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Promosi</h1>
        <Button onClick={() => { resetForm(); setShowModal(true); }}>
          <PlusIcon className="h-5 w-5 mr-2" />
          Tambah Promosi
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-12 text-gray-500">
          <p className="mb-4">Fitur promosi akan segera tersedia</p>
          <p className="text-sm">Anda akan dapat membuat dan mengelola promosi untuk apartemen</p>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingPromotion ? 'Edit Promosi' : 'Tambah Promosi'}
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Judul Promosi"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Contoh: Diskon Spesial Ramadan"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Diskon</label>
              <select
                value={formData.discount_type}
                onChange={(e) => setFormData(prev => ({ ...prev, discount_type: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="percentage">Persentase</option>
                <option value="fixed">Nominal</option>
              </select>
            </div>
            <Input
              label="Nilai Diskon"
              type="number"
              value={formData.discount_value}
              onChange={(e) => setFormData(prev => ({ ...prev, discount_value: e.target.value }))}
              placeholder={formData.discount_type === 'percentage' ? '10' : '1000000'}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Tanggal Mulai"
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
            />
            <Input
              label="Tanggal Selesai"
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setShowModal(false)} fullWidth>
              Batal
            </Button>
            <Button onClick={handleSubmit} fullWidth>
              {editingPromotion ? 'Perbarui' : 'Tambah'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PromotionManagement;