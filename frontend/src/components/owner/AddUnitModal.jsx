import { useState, useEffect } from 'react';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { toast } from 'react-hot-toast';
import axios from '../../api/axios';
import facilitiesAPI from '../../api/facilities';

const AddUnitModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '1BR',
    monthly_rent: '',
    deposit: '',
    availability_status: 'available',
    description: '',
    floor: '',
    furnished: true,
    facility_ids: [],
  });

  const [errors, setErrors] = useState({});
  const [photos, setPhotos] = useState([]);
  const [availableFacilities, setAvailableFacilities] = useState([]);
  const [loadingFacilities, setLoadingFacilities] = useState(false);
  const [customFacilityName, setCustomFacilityName] = useState('');
  const [customFacilities, setCustomFacilities] = useState([]); // Array of custom facility names

  const apartmentTypes = [
    { value: '1BR', label: '1 Bedroom', bedrooms: 1, bathrooms: 1 },
    { value: '2BR', label: '2 Bedroom', bedrooms: 2, bathrooms: 1 },
    { value: '3BR', label: '3 Bedroom', bedrooms: 3, bathrooms: 2 },
  ];

  // Fetch facilities and reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      // Reset form to initial state
      setFormData({
        name: '',
        type: '1BR',
        monthly_rent: '',
        deposit: '',
        availability_status: 'available',
        description: '',
        floor: '',
        furnished: true,
        facility_ids: [],
      });
      setPhotos([]);
      setErrors({});
      setCustomFacilityName('');
      setCustomFacilities([]);

      // Fetch facilities
      fetchFacilities();
    }
  }, [isOpen]);

  const fetchFacilities = async () => {
    setLoadingFacilities(true);
    try {
      const response = await facilitiesAPI.getFacilities({ category: 'unit', status: 'active' });
      setAvailableFacilities(response.facilities || []);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      toast.error('Gagal memuat fasilitas');
    } finally {
      setLoadingFacilities(false);
    }
  };

  // Get bedrooms and bathrooms based on selected type
  const getUnitSpecs = (type) => {
    const selectedType = apartmentTypes.find(t => t.value === type);
    return selectedType || { bedrooms: 1, bathrooms: 1 };
  };

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

  const handleFacilityToggle = (facilityId) => {
    setFormData(prev => ({
      ...prev,
      facility_ids: prev.facility_ids.includes(facilityId)
        ? prev.facility_ids.filter(id => id !== facilityId)
        : [...prev.facility_ids, facilityId]
    }));
  };

  const handleAddCustomFacility = () => {
    const trimmedName = customFacilityName.trim();

    if (!trimmedName) {
      toast.error('Nama fasilitas tidak boleh kosong');
      return;
    }

    if (trimmedName.length > 50) {
      toast.error('Nama fasilitas maksimal 50 karakter');
      return;
    }

    // Check for duplicates in custom facilities
    if (customFacilities.some(f => f.toLowerCase() === trimmedName.toLowerCase())) {
      toast.error('Fasilitas custom sudah ditambahkan');
      return;
    }

    // Add to local state (not database yet)
    setCustomFacilities(prev => [...prev, trimmedName]);
    setCustomFacilityName('');
    toast.success('Fasilitas custom ditambahkan ke daftar');
  };

  const removeCustomFacility = (index) => {
    setCustomFacilities(prev => prev.filter((_, i) => i !== index));
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
    if (!formData.monthly_rent || formData.monthly_rent <= 0) newErrors.monthly_rent = 'Harga sewa harus lebih dari 0';
    if (!formData.deposit || formData.deposit <= 0) newErrors.deposit = 'Deposit harus lebih dari 0';
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
      // Get bedrooms and bathrooms based on selected type
      const specs = getUnitSpecs(formData.type);

      // Step 1: Create custom facilities if any
      const customFacilityIds = [];
      if (customFacilities.length > 0) {
        for (const facilityName of customFacilities) {
          try {
            const response = await facilitiesAPI.createCustomFacility(facilityName);
            customFacilityIds.push(response.facility.id);
          } catch (error) {
            console.error(`Error creating custom facility "${facilityName}":`, error);
            // Continue with other facilities even if one fails
          }
        }
      }

      // Step 2: Create apartment with JSON data (combine standard and custom facility IDs)
      const allFacilityIds = [...formData.facility_ids, ...customFacilityIds];

      const apartmentData = {
        unit_number: formData.name,
        unit_type: formData.type,
        bedrooms: specs.bedrooms,
        bathrooms: specs.bathrooms,
        floor: parseInt(formData.floor),
        price_per_month: parseFloat(formData.monthly_rent),
        deposit_amount: parseFloat(formData.deposit),
        description: formData.description,
        furnished: formData.furnished,
        availability_status: formData.availability_status,
        facility_ids: allFacilityIds,
      };

      const response = await axios.post('/apartments', apartmentData);
      const newApartment = response.data.apartment;

      // Step 3: Upload photos if any
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
    // Reset akan dilakukan di useEffect saat modal dibuka lagi
    // Tapi tetap reset untuk memastikan konsistensi
    setFormData({
      name: '',
      type: '1BR',
      monthly_rent: '',
      deposit: '',
      availability_status: 'available',
      description: '',
      floor: '',
      furnished: true,
      facility_ids: [],
    });
    setPhotos([]);
    setErrors({});
    setCustomFacilityName('');
    setCustomFacilities([]);
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
              Fasilitas Standar
            </label>
            {loadingFacilities ? (
              <p className="text-sm text-gray-500">Memuat fasilitas...</p>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                  {availableFacilities.map(facility => (
                    <label
                      key={facility.id}
                      className="flex items-center space-x-2 text-xs cursor-pointer p-2 rounded hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={formData.facility_ids.includes(facility.id)}
                        onChange={() => handleFacilityToggle(facility.id)}
                        className="rounded text-purple-600 focus:ring-purple-500"
                      />
                      <span>{facility.name}</span>
                    </label>
                  ))}
                </div>

                {/* Add Custom Facility */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-600 mb-2">
                    Tambahkan fasilitas custom (akan dibuat saat unit disimpan)
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customFacilityName}
                      onChange={(e) => setCustomFacilityName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomFacility();
                        }
                      }}
                      placeholder="Contoh: Balkon, Smart Lock, dll"
                      maxLength={50}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddCustomFacility}
                      disabled={!customFacilityName.trim()}
                    >
                      Tambah
                    </Button>
                  </div>

                  {/* Display Custom Facilities */}
                  {customFacilities.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-gray-600 font-medium">Fasilitas Custom yang Ditambahkan:</p>
                      <div className="flex flex-wrap gap-2">
                        {customFacilities.map((facility, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-md text-xs"
                          >
                            <span>{facility}</span>
                            <button
                              type="button"
                              onClick={() => removeCustomFacility(index)}
                              className="text-purple-600 hover:text-purple-800"
                            >
                              <XMarkIcon className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
            {!loadingFacilities && availableFacilities.length === 0 && (
              <p className="text-sm text-gray-500">Belum ada fasilitas yang tersedia</p>
            )}
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
