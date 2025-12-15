import { useState, useEffect } from 'react';
import { XMarkIcon, PhotoIcon, TrashIcon } from '@heroicons/react/24/outline';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { toast } from 'react-hot-toast';
import axios from '../../api/axios';
import facilitiesAPI from '../../api/facilities';

const EditUnitModal = ({ isOpen, onClose, onSuccess, apartment }) => {
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
    const [newPhotos, setNewPhotos] = useState([]);
    const [existingPhotos, setExistingPhotos] = useState([]);
    const [photosToDelete, setPhotosToDelete] = useState([]);
    const [availableFacilities, setAvailableFacilities] = useState([]);
    const [loadingFacilities, setLoadingFacilities] = useState(false);
    const [customFacilityName, setCustomFacilityName] = useState('');
    const [customFacilities, setCustomFacilities] = useState([]);

    const apartmentTypes = [
    { value: '1BR', label: '1 Bedroom', bedrooms: 1, bathrooms: 1 },
    { value: '2BR', label: '2 Bedroom', bedrooms: 2, bathrooms: 1 },
    { value: '3BR', label: '3 Bedroom', bedrooms: 3, bathrooms: 2 },
    ];

  // Get bedrooms and bathrooms based on selected type
    const getUnitSpecs = (type) => {
    const selectedType = apartmentTypes.find(t => t.value === type);
    return selectedType || { bedrooms: 1, bathrooms: 1 };
    };

    const fetchFacilities = async () => {
        setLoadingFacilities(true);
        try {
            const response = await facilitiesAPI.getFacilities({
                category: 'unit',
                status: 'active',
                is_custom: 'false' // Only fetch standard facilities, not custom ones
            });
            setAvailableFacilities(response.facilities || []);
        } catch (error) {
            console.error('Error fetching facilities:', error);
            toast.error('Gagal memuat fasilitas');
        } finally {
            setLoadingFacilities(false);
        }
    };

  // Load apartment data when modal opens
    useEffect(() => {
    if (apartment && isOpen) {
        setFormData({
        name: apartment.unit_number || '',
        type: apartment.unit_type || '1BR',
        monthly_rent: apartment.price_per_month || '',
        deposit: apartment.deposit_amount || '',
        availability_status: apartment.availability_status || 'available',
        description: apartment.description || '',
        floor: apartment.floor || '',
        furnished: apartment.furnished !== undefined ? apartment.furnished : true,
        facility_ids: apartment.facilities ? apartment.facilities.map(f => f.facility?.id || f.id).filter(id => id) : [],
        });
        setExistingPhotos(apartment.photos || []);
        setNewPhotos([]);
        setPhotosToDelete([]);
        setErrors({});
        setCustomFacilityName('');
        setCustomFacilities([]);

        // Fetch facilities
        fetchFacilities();
    }
    }, [apartment, isOpen]);

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
    const totalPhotos = existingPhotos.length - photosToDelete.length + newPhotos.length + files.length;

    if (totalPhotos > 5) {
        toast.error('Maksimal 5 foto');
        return;
    }
    setNewPhotos(prev => [...prev, ...files]);
    };

    const removeNewPhoto = (index) => {
    setNewPhotos(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingPhoto = (photoId) => {
    setPhotosToDelete(prev => [...prev, photoId]);
    };

    const restoreExistingPhoto = (photoId) => {
    setPhotosToDelete(prev => prev.filter(id => id !== photoId));
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

      // Step 2: Update apartment data (combine standard and custom facility IDs)
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

        const response = await axios.put(`/apartments/${apartment.id}`, apartmentData);

      // Step 3: Delete marked photos
        for (const photoId of photosToDelete) {
        try {
            await axios.delete(`/apartments/${apartment.id}/photos/${photoId}`);
        } catch (error) {
            console.error('Error deleting photo:', error);
        }
        }

      // Step 4: Upload new photos
        for (let i = 0; i < newPhotos.length; i++) {
        const photoData = new FormData();
        photoData.append('photo', newPhotos[i]);
        // First photo is cover if no existing photos left
        const isFirstPhoto = existingPhotos.length - photosToDelete.length === 0 && i === 0;
        photoData.append('is_cover', isFirstPhoto ? 'true' : 'false');

        await axios.post(`/apartments/${apartment.id}/photos`, photoData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            },
        });
        }

        toast.success('Unit berhasil diperbarui!');
        onSuccess(response.data.apartment);
        handleClose();
    } catch (error) {
        console.error('Error updating unit:', error);
        toast.error(error.response?.data?.message || 'Gagal memperbarui unit');
    } finally {
        setLoading(false);
    }
    };

    const handleClose = () => {
    if (!loading) {
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
        setNewPhotos([]);
        setExistingPhotos([]);
        setPhotosToDelete([]);
        setErrors({});
        setCustomFacilityName('');
        setCustomFacilities([]);
        onClose();
    }
    };

    if (!apartment) return null;

    return (
    <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Edit Unit Apartemen"
        size="xl"
    >
        <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
            label="Nama Unit"
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

        {/* Furnished Toggle */}
        <div className="flex items-center space-x-2">
            <input
            type="checkbox"
            name="furnished"
            checked={formData.furnished}
            onChange={handleChange}
            className="rounded text-purple-600 focus:ring-purple-500"
            />
            <label className="text-sm font-medium text-gray-700">
            Fully Furnished
            </label>
        </div>

        {/* Photos Section */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
            Foto Unit
            </label>

          {/* Existing Photos */}
            {existingPhotos.length > 0 && (
            <div className="mb-3">
                <p className="text-xs text-gray-500 mb-2">Foto Saat Ini:</p>
                <div className="grid grid-cols-5 gap-2">
                {existingPhotos.map((photo) => {
                    const isMarkedForDeletion = photosToDelete.includes(photo.id);
                    return (
                    <div key={photo.id} className="relative">
                        <img
                        src={import.meta.env.VITE_API_URL + photo.photo_url}
                        alt="Unit"
                        className={`w-full h-20 object-cover rounded ${
                            isMarkedForDeletion ? 'opacity-50' : ''
                        }`}
                        />
                        {isMarkedForDeletion ? (
                        <button
                            type="button"
                            onClick={() => restoreExistingPhoto(photo.id)}
                            className="absolute top-1 right-1 p-1 bg-green-500 hover:bg-green-600 rounded-full text-white"
                        >
                            <XMarkIcon className="h-3 w-3" />
                        </button>
                        ) : (
                        <button
                            type="button"
                            onClick={() => removeExistingPhoto(photo.id)}
                            className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 rounded-full text-white"
                        >
                            <TrashIcon className="h-3 w-3" />
                        </button>
                        )}
                        {photo.is_cover && (
                        <span className="absolute bottom-1 left-1 text-xs bg-purple-600 text-white px-1 py-0.5 rounded">
                            Cover
                        </span>
                        )}
                    </div>
                    );
                })}
                </div>
            </div>
            )}

          {/* New Photos Preview */}
            {newPhotos.length > 0 && (
            <div className="mb-3">
                <p className="text-xs text-gray-500 mb-2">Foto Baru:</p>
                <div className="grid grid-cols-5 gap-2">
                {newPhotos.map((photo, index) => (
                    <div key={index} className="relative">
                    <img
                        src={URL.createObjectURL(photo)}
                        alt="New"
                        className="w-full h-20 object-cover rounded"
                    />
                    <button
                        type="button"
                        onClick={() => removeNewPhoto(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 rounded-full text-white"
                    >
                        <XMarkIcon className="h-3 w-3" />
                    </button>
                    </div>
                ))}
                </div>
            </div>
            )}

          {/* Upload Button */}
            <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <div className="flex flex-col items-center justify-center">
                <PhotoIcon className="h-6 w-6 text-gray-400" />
                <p className="text-xs text-gray-500">Upload foto (Max 5)</p>
            </div>
            <input
                type="file"
                className="hidden"
                multiple
                accept="image/*"
                onChange={handlePhotoChange}
            />
            </label>
            <p className="text-xs text-gray-500 mt-1">
            Total: {existingPhotos.length - photosToDelete.length + newPhotos.length}/5 foto
            </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
            <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
            fullWidth
            >
            Batal
            </Button>
            <Button
            type="submit"
            loading={loading}
            fullWidth
            >
            Simpan Perubahan
            </Button>
        </div>
        </form>
    </Modal>
    );
};

export default EditUnitModal;