import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../stores/authStore';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { validateForm } from '../utils/validators';
import { toast } from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: '',
    role: 'tenant',
    address: '',
    birth_date: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const register = useAuthStore(state => state.register);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    const validationErrors = validateForm(formData, {
      username: { required: true, minLength: 3, label: 'Username' },
      email: { required: true, email: true, label: 'Email' },
      password: { required: true, minLength: 6, label: 'Password' },
      full_name: { required: true, label: 'Nama Lengkap' },
      phone: { required: true, phone: true, label: 'Nomor Telepon' },
      role: { required: true, label: 'Peran' }
    });
    
    // Check password confirmation
    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = 'Password tidak cocok';
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      const { confirmPassword, ...registerData } = formData;
      const result = await register(registerData);
      
      if (result.success) {
        toast.success('Registrasi berhasil! Silakan login.');
        navigate('/login');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        {/* Header */}
        <div>
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">VV</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Daftar Akun Baru
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Buat akun Vida View untuk mulai mencari apartemen impian Anda
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Daftar Sebagai <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, role: 'tenant' }))}
                className={`p-4 border-2 rounded-lg text-center transition-colors ${
                  formData.role === 'tenant'
                    ? 'border-purple-600 bg-purple-50 text-purple-600'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <UserIcon className="h-6 w-6 mx-auto mb-2" />
                <div className="font-semibold">Penyewa</div>
                <div className="text-xs text-gray-500">Mencari apartemen</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, role: 'owner' }))}
                className={`p-4 border-2 rounded-lg text-center transition-colors ${
                  formData.role === 'owner'
                    ? 'border-purple-600 bg-purple-50 text-purple-600'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <UserIcon className="h-6 w-6 mx-auto mb-2" />
                <div className="font-semibold">Pemilik</div>
                <div className="text-xs text-gray-500">Menyewakan unit</div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              placeholder="username"
              icon={<UserIcon className="h-5 w-5" />}
              required
            />

            <Input
              label="Nama Lengkap"
              name="full_name"
              type="text"
              value={formData.full_name}
              onChange={handleChange}
              error={errors.full_name}
              placeholder="Nama lengkap Anda"
              icon={<UserIcon className="h-5 w-5" />}
              required
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="nama@email.com"
              icon={<EnvelopeIcon className="h-5 w-5" />}
              required
            />

            <Input
              label="Nomor Telepon"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="08xxxxxxxxxx"
              icon={<PhoneIcon className="h-5 w-5" />}
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Minimal 6 karakter"
              icon={<LockClosedIcon className="h-5 w-5" />}
              required
            />

            <Input
              label="Konfirmasi Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="Ulangi password"
              icon={<LockClosedIcon className="h-5 w-5" />}
              required
            />
          </div>

          {/* Optional Fields */}
          <div className="space-y-4">
            <Input
              label="Alamat (Opsional)"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              placeholder="Alamat lengkap"
              icon={<MapPinIcon className="h-5 w-5" />}
            />

            <Input
              label="Tanggal Lahir (Opsional)"
              name="birth_date"
              type="date"
              value={formData.birth_date}
              onChange={handleChange}
              icon={<CalendarIcon className="h-5 w-5" />}
            />
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              Saya setuju dengan{' '}
              <Link to="/terms" className="text-purple-600 hover:text-purple-500">
                Syarat & Ketentuan
              </Link>
              {' '}dan{' '}
              <Link to="/privacy" className="text-purple-600 hover:text-purple-500">
                Kebijakan Privasi
              </Link>
            </label>
          </div>

          <Button
            type="submit"
            fullWidth
            loading={loading}
            disabled={loading}
          >
            Daftar Sekarang
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Sudah punya akun?{' '}
              <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500">
                Login di sini
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;