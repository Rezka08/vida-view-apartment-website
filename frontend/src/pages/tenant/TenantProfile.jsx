import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  CameraIcon,
  KeyIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import usersAPI from '../../api/users';
import useAuthStore from '../../stores/authStore';
import useUserStore from '../../stores/userStore';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import Loading from '../../components/common/Loading';
import { formatDate } from '../../utils/formatters';
import { validateForm } from '../../utils/validators';

const TenantProfile = () => {
  const { user, updateUser, changePassword } = useAuthStore();
  const { profile, fetchProfile, uploadProfilePhoto } = useUserStore();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    birth_date: '',
    id_card_number: ''
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const profileData = await fetchProfile();
      setProfileData({
        full_name: profileData.full_name || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        address: profileData.address || '',
        birth_date: profileData.birth_date || '',
        id_card_number: profileData.id_card_number || ''
      });
    } catch (error) {
      toast.error('Gagal memuat profil');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm(profileData, {
      full_name: { required: true, label: 'Nama Lengkap' },
      email: { required: true, email: true, label: 'Email' },
      phone: { required: true, phone: true, label: 'Nomor Telepon' }
    });
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setSaving(true);
    try {
      const response = await usersAPI.updateProfile(profileData);
      updateUser(response.user);
      toast.success('Profil berhasil diperbarui!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal memperbarui profil');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran foto maksimal 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar');
      return;
    }

    setUploadingPhoto(true);
    try {
      await uploadProfilePhoto(file);
      toast.success('Foto profil berhasil diupdate!');
      loadProfile();
    } catch (error) {
      toast.error('Gagal mengupload foto');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleChangePassword = async () => {
    const validationErrors = validateForm(passwordData, {
      current_password: { required: true, label: 'Password Saat Ini' },
      new_password: { required: true, minLength: 6, label: 'Password Baru' },
      confirm_password: { required: true, label: 'Konfirmasi Password' }
    });

    if (passwordData.new_password !== passwordData.confirm_password) {
      validationErrors.confirm_password = 'Password tidak cocok';
    }

    if (Object.keys(validationErrors).length > 0) {
      setPasswordErrors(validationErrors);
      return;
    }

    setSaving(true);
    try {
      await changePassword(passwordData.current_password, passwordData.new_password);
      toast.success('Password berhasil diubah!');
      setShowPasswordModal(false);
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      setPasswordErrors({});
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengubah password');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading fullScreen text="Memuat profil..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1>
        <p className="text-gray-600">Kelola informasi profil Anda</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Photo Card */}
        <div className="lg:col-span-1">
          <Card>
            <div className="text-center">
              <div className="relative inline-block">
                {profile?.profile_photo ? (
                  <img
                    src={profile.profile_photo}
                    alt={profile.full_name}
                    className="w-32 h-32 rounded-full object-cover mx-auto"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-purple-100 flex items-center justify-center mx-auto">
                    <UserCircleIcon className="h-20 w-20 text-purple-600" />
                  </div>
                )}
                
                <label
                  htmlFor="photo-upload"
                  className="absolute bottom-0 right-0 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-700 transition-colors shadow-lg"
                >
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={uploadingPhoto}
                  />
                  {uploadingPhoto ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  ) : (
                    <CameraIcon className="h-5 w-5 text-white" />
                  )}
                </label>
              </div>

              <h3 className="mt-4 text-xl font-semibold text-gray-900">
                {profile?.full_name}
              </h3>
              <p className="text-sm text-gray-500 capitalize">{user?.role}</p>

              {profile?.document_verified_at && (
                <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                  Terverifikasi
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Member sejak</span>
                    <span className="font-medium text-gray-900">
                      {formatDate(profile?.created_at, 'short')}
                    </span>
                  </div>
                  {profile?.last_login_at && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Login terakhir</span>
                      <span className="font-medium text-gray-900">
                        {formatDate(profile?.last_login_at, 'time')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <Button
                variant="outline"
                fullWidth
                className="mt-6"
                onClick={() => setShowPasswordModal(true)}
              >
                <KeyIcon className="h-5 w-5 mr-2" />
                Ubah Password
              </Button>
            </div>
          </Card>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <Card title="Informasi Pribadi">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nama Lengkap"
                name="full_name"
                value={profileData.full_name}
                onChange={handleChange}
                error={errors.full_name}
                icon={<UserCircleIcon className="h-5 w-5" />}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleChange}
                  error={errors.email}
                  icon={<EnvelopeIcon className="h-5 w-5" />}
                  required
                />

                <Input
                  label="Nomor Telepon"
                  name="phone"
                  type="tel"
                  value={profileData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  icon={<PhoneIcon className="h-5 w-5" />}
                  required
                />
              </div>

              <Input
                label="Alamat"
                name="address"
                value={profileData.address}
                onChange={handleChange}
                error={errors.address}
                icon={<MapPinIcon className="h-5 w-5" />}
                placeholder="Alamat lengkap"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Tanggal Lahir"
                  name="birth_date"
                  type="date"
                  value={profileData.birth_date}
                  onChange={handleChange}
                  error={errors.birth_date}
                  icon={<CalendarIcon className="h-5 w-5" />}
                />

                <Input
                  label="Nomor KTP"
                  name="id_card_number"
                  value={profileData.id_card_number}
                  onChange={handleChange}
                  error={errors.id_card_number}
                  placeholder="16 digit nomor KTP"
                  maxLength={16}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={loadProfile}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  loading={saving}
                  disabled={saving}
                >
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          </Card>

          {/* Account Settings */}
          <Card title="Pengaturan Akun" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Status Akun</h4>
                  <p className="text-sm text-gray-600">
                    Akun Anda saat ini {user?.status === 'active' ? 'aktif' : 'tidak aktif'}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user?.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user?.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Notifikasi Email</h4>
                  <p className="text-sm text-gray-600">
                    Terima update via email
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Notifikasi Push</h4>
                  <p className="text-sm text-gray-600">
                    Terima notifikasi di browser
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setPasswordData({
            current_password: '',
            new_password: '',
            confirm_password: ''
          });
          setPasswordErrors({});
        }}
        title="Ubah Password"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Password Saat Ini"
            name="current_password"
            type="password"
            value={passwordData.current_password}
            onChange={handlePasswordChange}
            error={passwordErrors.current_password}
            placeholder="Masukkan password saat ini"
            required
          />

          <Input
            label="Password Baru"
            name="new_password"
            type="password"
            value={passwordData.new_password}
            onChange={handlePasswordChange}
            error={passwordErrors.new_password}
            placeholder="Minimal 6 karakter"
            required
          />

          <Input
            label="Konfirmasi Password Baru"
            name="confirm_password"
            type="password"
            value={passwordData.confirm_password}
            onChange={handlePasswordChange}
            error={passwordErrors.confirm_password}
            placeholder="Ulangi password baru"
            required
          />

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Tips:</strong> Gunakan kombinasi huruf besar, huruf kecil, angka, dan simbol untuk password yang lebih aman.
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setShowPasswordModal(false);
                setPasswordData({
                  current_password: '',
                  new_password: '',
                  confirm_password: ''
                });
                setPasswordErrors({});
              }}
              fullWidth
            >
              Batal
            </Button>
            <Button
              onClick={handleChangePassword}
              loading={saving}
              disabled={saving}
              fullWidth
            >
              Ubah Password
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TenantProfile;