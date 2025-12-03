import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../stores/authStore';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

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
      role: { required: true, label: 'Peran' },
      birth_date: { required: true, label: 'Tanggal Lahir' }
    });

    // Check password confirmation
    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = 'Password tidak cocok';
    }

    // Check age (must be 18+)
    if (formData.birth_date) {
      const birthDate = new Date(formData.birth_date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();

      const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

      if (actualAge < 18) {
        validationErrors.birth_date = 'Anda harus berusia minimal 18 tahun';
      }
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
            <img 
              src="/img/logo.png" 
              alt="Vida View Logo" 
              className="h-40 w-auto"
            />
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

            <div className="relative">
              <Input
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="Minimal 6 karakter"
                icon={<LockClosedIcon className="h-5 w-5" />}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="relative">
              <Input
                label="Konfirmasi Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                placeholder="Ulangi password"
                icon={<LockClosedIcon className="h-5 w-5" />}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Birth Date - Required */}
          <Input
            label="Tanggal Lahir"
            name="birth_date"
            type="date"
            value={formData.birth_date}
            onChange={handleChange}
            error={errors.birth_date}
            icon={<CalendarIcon className="h-5 w-5" />}
            required
            max={new Date().toISOString().split('T')[0]}
          />

          {/* Optional Fields */}
          <Input
            label="Alamat (Opsional)"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
            placeholder="Alamat lengkap"
            icon={<MapPinIcon className="h-5 w-5" />}
          />

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
              <button
                type="button"
                onClick={() => setShowTermsModal(true)}
                className="text-purple-600 hover:text-purple-500 underline"
              >
                Syarat & Ketentuan
              </button>
              {' '}dan{' '}
              <button
                type="button"
                onClick={() => setShowPrivacyModal(true)}
                className="text-purple-600 hover:text-purple-500 underline"
              >
                Kebijakan Privasi
              </button>
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

      {/* Terms Modal */}
      <Modal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        title="Syarat dan Ketentuan"
        size="xl"
      >
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            1. Penerimaan Syarat
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Dengan mengakses dan menggunakan platform Vida View, Anda setuju untuk terikat oleh syarat dan ketentuan ini. Jika Anda tidak setuju dengan syarat dan ketentuan ini, mohon untuk tidak menggunakan layanan kami.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            2. Definisi Pengguna
                        </h2>
                        <div className="text-gray-700 leading-relaxed space-y-2">
                            <p><strong>Penyewa:</strong> Pengguna yang mencari dan menyewa unit apartemen melalui platform.</p>
                            <p><strong>Pemilik:</strong> Pengguna yang mendaftarkan dan menyewakan unit apartemen melalui platform.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            3. Registrasi Akun
                        </h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Anda harus berusia minimal 18 tahun untuk membuat akun</li>
                            <li>Informasi yang Anda berikan harus akurat dan terkini</li>
                            <li>Anda bertanggung jawab untuk menjaga kerahasiaan password</li>
                            <li>Satu akun hanya untuk satu pengguna</li>
                            <li>Vida View berhak menangguhkan atau menghapus akun yang melanggar ketentuan</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            4. Kewajiban Penyewa
                        </h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Memberikan informasi yang benar saat melakukan pemesanan</li>
                            <li>Melakukan pembayaran sesuai dengan kesepakatan</li>
                            <li>Menjaga unit apartemen dengan baik selama masa sewa</li>
                            <li>Mematuhi aturan yang ditetapkan oleh pemilik dan pengelola apartemen</li>
                            <li>Melaporkan kerusakan atau masalah pada unit tepat waktu</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            5. Kewajiban Pemilik
                        </h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Memberikan informasi yang akurat tentang unit apartemen</li>
                            <li>Memastikan unit dalam kondisi layak huni</li>
                            <li>Menyediakan fasilitas sesuai yang tercantum dalam listing</li>
                            <li>Merespons keluhan dan pertanyaan penyewa dengan cepat</li>
                            <li>Tidak melakukan diskriminasi terhadap calon penyewa</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            6. Pembayaran dan Biaya
                        </h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Semua harga tercantum dalam Rupiah (IDR)</li>
                            <li>Pembayaran dilakukan melalui metode yang tersedia di platform</li>
                            <li>Vida View mengenakan biaya layanan untuk setiap transaksi</li>
                            <li>Pemilik menerima pembayaran setelah dikurangi biaya platform</li>
                            <li>Pengembalian dana mengikuti kebijakan pembatalan yang berlaku</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            7. Kebijakan Pembatalan
                        </h2>
                        <div className="text-gray-700 space-y-3">
                            <p><strong>Pembatalan oleh Penyewa:</strong></p>
                            <ul className="list-disc list-inside ml-4 space-y-1">
                                <li>Lebih dari 30 hari sebelum check-in: pengembalian 100%</li>
                                <li>15-30 hari sebelum check-in: pengembalian 50%</li>
                                <li>Kurang dari 15 hari: tidak ada pengembalian</li>
                            </ul>
                            <p className="mt-3"><strong>Pembatalan oleh Pemilik:</strong></p>
                            <ul className="list-disc list-inside ml-4 space-y-1">
                                <li>Pengembalian 100% kepada penyewa</li>
                                <li>Denda untuk pemilik yang sering membatalkan</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            8. Larangan Penggunaan
                        </h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Menggunakan platform untuk tujuan ilegal</li>
                            <li>Memposting konten yang menyesatkan atau palsu</li>
                            <li>Melakukan penipuan atau aktivitas mencurigakan</li>
                            <li>Mengganggu operasional platform</li>
                            <li>Melanggar hak kekayaan intelektual</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            9. Tanggung Jawab Platform
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Vida View bertindak sebagai perantara antara penyewa dan pemilik. Kami tidak bertanggung jawab atas:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-2">
                            <li>Kualitas, kondisi, atau keamanan unit apartemen</li>
                            <li>Perilaku pengguna di luar platform</li>
                            <li>Sengketa antara penyewa dan pemilik</li>
                            <li>Kerugian akibat force majeure</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            10. Perubahan Syarat dan Ketentuan
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Vida View berhak mengubah syarat dan ketentuan ini kapan saja. Perubahan akan diberitahukan melalui email atau notifikasi di platform. Penggunaan platform setelah perubahan berarti Anda menyetujui syarat dan ketentuan yang baru.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            11. Hukum yang Berlaku
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Syarat dan ketentuan ini diatur oleh hukum Republik Indonesia. Setiap sengketa akan diselesaikan melalui musyawarah atau melalui pengadilan yang berwenang di Indonesia.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            12. Kontak
                        </h2>
            <p className="text-gray-700 leading-relaxed">
              Jika Anda memiliki pertanyaan tentang syarat dan ketentuan ini, silakan hubungi kami:
            </p>
              <div className="mt-3 text-gray-700 space-y-1">
              <p>Email: legal@vidaview.com</p>
              <p>Telepon: +62 811-2345-6789</p>
              <p>Alamat: Jl. Perintis Kemerdekaan KM. 10, Makassar, Sulawesi Selatan</p>
            </div>
          </section>
        </div>
      </Modal>

      {/* Privacy Modal */}
      <Modal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        title="Kebijakan Privasi"
        size="xl"
      >
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            1. Pendahuluan
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Vida View ("kami", "kami", "platform") berkomitmen untuk melindungi privasi Anda. Kebijakan privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, membagikan, dan melindungi informasi pribadi Anda ketika Anda menggunakan layanan kami.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            2. Informasi yang Kami Kumpulkan
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">2.1 Informasi yang Anda Berikan</h3>
                                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                                    <li>Nama lengkap</li>
                                    <li>Username</li>
                                    <li>Alamat email</li>
                                    <li>Nomor telepon</li>
                                    <li>Alamat</li>
                                    <li>Tanggal lahir</li>
                                    <li>Foto profil</li>
                                    <li>Informasi pembayaran</li>
                                    <li>Dokumen verifikasi (KTP, NPWP untuk pemilik)</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">2.2 Informasi yang Dikumpulkan Secara Otomatis</h3>
                                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                                    <li>Alamat IP</li>
                                    <li>Jenis browser dan perangkat</li>
                                    <li>Sistem operasi</li>
                                    <li>Halaman yang Anda kunjungi</li>
                                    <li>Waktu dan durasi kunjungan</li>
                                    <li>Data lokasi (dengan izin Anda)</li>
                                    <li>Cookie dan teknologi pelacakan serupa</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">2.3 Informasi dari Pihak Ketiga</h3>
                                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                                    <li>Informasi dari media sosial (jika Anda login menggunakan akun sosial)</li>
                                    <li>Data verifikasi dari layanan pihak ketiga</li>
                                    <li>Informasi pembayaran dari payment gateway</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            3. Cara Kami Menggunakan Informasi Anda
                        </h2>
                        <p className="text-gray-700 mb-3">Kami menggunakan informasi yang dikumpulkan untuk:</p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Menyediakan, mengoperasikan, dan meningkatkan layanan kami</li>
                            <li>Memproses transaksi dan mengirimkan konfirmasi</li>
                            <li>Mengirimkan notifikasi tentang pemesanan, pembayaran, dan aktivitas akun</li>
                            <li>Merespons pertanyaan dan memberikan dukungan pelanggan</li>
                            <li>Mendeteksi dan mencegah penipuan atau aktivitas ilegal</li>
                            <li>Personalisasi pengalaman pengguna</li>
                            <li>Mengirimkan informasi pemasaran (dengan persetujuan Anda)</li>
                            <li>Melakukan analisis dan riset untuk meningkatkan layanan</li>
                            <li>Mematuhi kewajiban hukum</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            4. Pembagian Informasi
                        </h2>
                        <p className="text-gray-700 mb-3">Kami dapat membagikan informasi Anda dengan:</p>

                        <div className="space-y-3">
                            <div>
                                <h3 className="font-semibold text-gray-900">Pengguna Lain</h3>
                                <p className="text-gray-700 ml-4">
                                    Penyewa dapat melihat informasi dasar pemilik (nama, foto profil, rating). Pemilik dapat melihat informasi penyewa yang memesan unit mereka.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900">Penyedia Layanan Pihak Ketiga</h3>
                                <p className="text-gray-700 ml-4">
                                    Payment gateway, layanan hosting, analitik, email service, dan layanan teknis lainnya yang membantu operasional platform.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900">Otoritas Hukum</h3>
                                <p className="text-gray-700 ml-4">
                                    Jika diwajibkan oleh hukum atau untuk melindungi hak, keamanan, dan keselamatan.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900">Transfer Bisnis</h3>
                                <p className="text-gray-700 ml-4">
                                    Dalam hal merger, akuisisi, atau penjualan aset perusahaan.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            5. Keamanan Data
                        </h2>
                        <p className="text-gray-700 mb-3">
                            Kami menerapkan langkah-langkah keamanan untuk melindungi informasi Anda:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Enkripsi data menggunakan SSL/TLS</li>
                            <li>Penyimpanan password menggunakan hashing yang aman</li>
                            <li>Akses terbatas ke informasi pribadi</li>
                            <li>Monitoring keamanan secara berkala</li>
                            <li>Firewall dan perlindungan terhadap serangan</li>
                        </ul>
                        <p className="text-gray-700 mt-3">
                            Namun, tidak ada sistem yang 100% aman. Kami mendorong Anda untuk melindungi password dan tidak membagikannya kepada siapa pun.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            6. Cookie dan Teknologi Pelacakan
                        </h2>
                        <p className="text-gray-700 mb-3">
                            Kami menggunakan cookie dan teknologi serupa untuk:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Mengingat preferensi Anda</li>
                            <li>Memahami cara Anda menggunakan platform</li>
                            <li>Meningkatkan keamanan</li>
                            <li>Menyajikan iklan yang relevan</li>
                        </ul>
                        <p className="text-gray-700 mt-3">
                            Anda dapat mengatur browser untuk menolak cookie, tetapi ini mungkin membatasi fungsi platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            7. Hak Anda
                        </h2>
                        <p className="text-gray-700 mb-3">Anda memiliki hak untuk:</p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li><strong>Akses:</strong> Meminta salinan informasi pribadi Anda</li>
                            <li><strong>Koreksi:</strong> Memperbarui atau memperbaiki informasi yang tidak akurat</li>
                            <li><strong>Penghapusan:</strong> Meminta penghapusan data Anda (dengan batasan tertentu)</li>
                            <li><strong>Pembatasan:</strong> Membatasi pemrosesan data Anda</li>
                            <li><strong>Portabilitas:</strong> Menerima data Anda dalam format yang dapat dibaca mesin</li>
                            <li><strong>Keberatan:</strong> Menolak pemrosesan data untuk tujuan tertentu</li>
                            <li><strong>Penarikan Persetujuan:</strong> Menarik persetujuan kapan saja</li>
                        </ul>
                        <p className="text-gray-700 mt-3">
                            Untuk menggunakan hak-hak ini, hubungi kami di privacy@vidaview.com
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            8. Penyimpanan Data
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Kami menyimpan informasi Anda selama akun Anda aktif atau sepanjang diperlukan untuk menyediakan layanan. Setelah akun dihapus, kami akan menghapus atau mengaononimkan data Anda, kecuali jika diwajibkan oleh hukum untuk menyimpannya lebih lama.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            9. Pengguna Anak-Anak
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Layanan kami tidak ditujukan untuk anak-anak di bawah 18 tahun. Kami tidak secara sengaja mengumpulkan informasi dari anak-anak. Jika Anda mengetahui bahwa anak Anda memberikan informasi kepada kami, hubungi kami segera.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            10. Transfer Data Internasional
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Informasi Anda dapat ditransfer dan disimpan di server yang berlokasi di luar negara Anda. Kami memastikan bahwa transfer tersebut dilakukan dengan perlindungan yang memadai sesuai hukum yang berlaku.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            11. Perubahan Kebijakan Privasi
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Perubahan akan diposting di halaman ini dengan tanggal "Terakhir diperbarui" yang baru. Kami mendorong Anda untuk meninjau kebijakan ini secara berkala.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            12. Hubungi Kami
                        </h2>
                        <p className="text-gray-700 mb-3">
                            Jika Anda memiliki pertanyaan tentang kebijakan privasi ini atau praktik privasi kami:
                        </p>
                        <div className="text-gray-700 space-y-1 ml-4">
                            <p><strong>Email:</strong> privacy@vidaview.com</p>
                            <p><strong>Telepon:</strong> +62 811-2345-6789</p>
                            <p><strong>Alamat:</strong> Jl. Perintis Kemerdekaan KM. 10, Makassar, Sulawesi Selatan 90245</p>
                        </div>
                    </section>

                    <section className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <h3 className="font-semibold text-purple-900 mb-2">
                            Persetujuan
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                            Dengan menggunakan layanan Vida View, Anda menyatakan bahwa Anda telah membaca, memahami, dan menyetujui kebijakan privasi ini.
                        </p>
                    </section>
                </div>
      </Modal>
    </div>
  );
};

export default Register;