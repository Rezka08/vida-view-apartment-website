import { useState } from 'react';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { toast } from 'react-hot-toast';
import axios from '../../api/axios';

const AddUnitModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'studio',
    size: '',
    monthly_rent: '',
    deposit: '',
    availability_status: 'available',
    description: '',
    address: '',
    floor: '',
    bedrooms: '0',
    bathrooms: '1',
    furnished: true,
    facilities: [],
  });

  const [errors, setErrors] = useState({});
  const [photos, setPhotos] = useState([]);

  const apartmentTypes = [
    { value: 'studio', label: 'Studio' },
    { value: '1BR', label: '1 Bedroom' },
    { value: '2BR', label: '2 Bedrooms' },
    { value: '3BR', label: '3 Bedrooms' },
    { value: 'penthouse', label: 'Penthouse' },
  ];

  const availableFacilities = [
    'AC', 'Wi-Fi', 'TV', 'Kulkas', 'Mesin Cuci', 'Water Heater',
    'Kitchen Set', 'Balkon', 'Parkir', 'Security 24/7'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFacilityToggle = (facility) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + photos.length > 5) {
      toast.error('Maksimal 5 foto');
      return;
    }
    setPhotos(prev => [...prev, ...files]);
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Nama unit harus diisi';
    if (formData.name.length > 20) newErrors.name = 'Nama unit maksimal 20 karakter';
    if (!formData.size || formData.size <= 0) newErrors.size = 'Luas harus lebih dari 0';
    if (!formData.monthly_rent || formData.monthly_rent <= 0) newErrors.monthly_rent = 'Harga sewa harus lebih dari 0';
    if (!formData.deposit || formData.deposit <= 0) newErrors.deposit = 'Deposit harus lebih dari 0';
    if (!formData.address.trim()) newErrors.address = 'Alamat harus diisi';
    if (!formData.floor) newErrors.floor = 'Lantai harus diisi';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create apartment with JSON data
      const apartmentData = {
        unit_number: formData.name,
        unit_type: formData.type,
        size_sqm: parseFloat(formData.size),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        floor: parseInt(formData.floor),
        price_per_month: parseFloat(formData.monthly_rent),
        deposit_amount: parseFloat(formData.deposit),
        description: `${formData.description}\n\nAlamat: ${formData.address}`.trim(),
        furnished: formData.furnished,
        availability_status: formData.availability_status,
      };

      const response = await axios.post('/apartments', apartmentData);
      const newApartment = response.data.apartment;

      // Step 2: Upload photos if any
      if (photos.length > 0) {
        for (let i = 0; i < photos.length; i++) {
          const photoData = new FormData();
          photoData.append('photo', photos[i]);
          photoData.append('is_cover', i === 0 ? 'true' : 'false');

          await axios.post(`/apartments/${newApartment.id}/photos`, photoData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        }
      }

      toast.success('Unit berhasil ditambahkan!');
      onSuccess(newApartment);
      handleClose();
    } catch (error) {
      console.error('Error adding unit:', error);
      toast.error(error.response?.data?.message || 'Gagal menambahkan unit');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      type: 'studio',
      size: '',
      monthly_rent: '',
      deposit: '',
      availability_status: 'available',
      description: '',
      address: '',
      floor: '',
      bedrooms: '0',
      bathrooms: '1',
      furnished: true,
      facilities: [],
    });
    setPhotos([]);
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Tambah Unit Baru"
      size="sm"
    >
      <div className="max-h-[75vh] overflow-y-auto pr-2">
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Basic Information - Single Column Layout */}
          <div className="space-y-3">
            <Input
              label="Nama Unit (Maks. 20 karakter)"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Contoh: A-1205"
              maxLength={20}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipe <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {apartmentTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Luas (m²)"
              name="size"
              type="number"
              value={formData.size}
              onChange={handleChange}
              error={errors.size}
              placeholder="45"
              required
            />

            <Input
              label="Kamar Tidur"
              name="bedrooms"
              type="number"
              value={formData.bedrooms}
              onChange={handleChange}
              min="0"
            />

            <Input
              label="Kamar Mandi"
              name="bathrooms"
              type="number"
              value={formData.bathrooms}
              onChange={handleChange}
              min="1"
              required
            />

            <Input
              label="Lantai"
              name="floor"
              type="number"
              value={formData.floor}
              onChange={handleChange}
              error={errors.floor}
              placeholder="12"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="availability_status"
                value={formData.availability_status}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="available">Tersedia</option>
                <option value="occupied">Terisi</option>
              </select>
            </div>

            <Input
              label="Harga Sewa/Bulan (Rp)"
              name="monthly_rent"
              type="number"
              value={formData.monthly_rent}
              onChange={handleChange}
              error={errors.monthly_rent}
              placeholder="5000000"
              required
            />

            <Input
              label="Deposit (Rp)"
              name="deposit"
              type="number"
              value={formData.deposit}
              onChange={handleChange}
              error={errors.deposit}
              placeholder="5000000"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alamat <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="2"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Jl. Sudirman No. 123, Jakarta Selatan"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="2"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Deskripsikan unit apartment Anda..."
              />
            </div>
          </div>

          {/* Facilities - Compact Grid */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fasilitas
            </label>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              {availableFacilities.map(facility => (
                <label
                  key={facility}
                  className="flex items-center space-x-1 text-xs cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.facilities.includes(facility)}
                    onChange={() => handleFacilityToggle(facility)}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>{facility}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Furnished Checkbox */}
          <div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="furnished"
                checked={formData.furnished}
                onChange={handleChange}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-gray-700">Fully Furnished</span>
            </label>
          </div>

          {/* Photos - Compact */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto Unit (Maks. 5)
            </label>

            {photos.length < 5 && (
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                <PhotoIcon className="w-8 h-8 text-gray-400 mb-1" />
                <p className="text-xs text-gray-500">Upload Foto</p>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoChange}
                />
              </label>
            )}

            {photos.length > 0 && (
              <div className="mt-2 grid grid-cols-5 gap-2">
                {photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-16 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-3 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
            >
              Tambah Unit
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddUnitModal;
