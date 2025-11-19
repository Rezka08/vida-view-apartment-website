import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BuildingOfficeIcon,
  ShieldCheckIcon,
  MapPinIcon,
  HomeModernIcon 
} from '@heroicons/react/24/outline';
import Button from '../components/common/Button';

const Home = () => {
  const navigate = useNavigate();

  // Menggunakan URL gambar yang diberikan oleh pengguna
  const imageUrl ='/img/vida_view.jpg';

  const features = [
    {
      name: '24/7 High Speed',
      description: 'Koneksi internet cepat 24/7',
      icon: HomeModernIcon
    },
    {
      name: 'CCTV & Area Aman',
      description: 'Area yang aman dengan petugas keamanan',
      icon: ShieldCheckIcon
    },
    {
      name: 'Fitness Center',
      description: 'Gym dengan peralatan modern',
      icon: BuildingOfficeIcon
    },
    {
      name: 'Kolam Renang',
      description: 'Kolam renang dengan kolam indoor & outdoor',
      icon: HomeModernIcon
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      comment: 'Apartemen yang sangat nyaman dengan fasilitas lengkap. Highly recommended!',
      rating: 5
    },
    {
      name: 'David Williams',
      comment: 'Lokasi strategis dan pelayanan yang baik. Sangat puas!',
      rating: 5
    },
    {
      name: 'Andi Wijaya',
      comment: 'Pelayanan terbaik dan unit sangat modern. Worth it!',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-[600px] bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-center w-full">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              VIDAVIEW APARTMENTS
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8">
              Lifestyle in Vibrant Atmosphere
            </p>
            <div className="max-w-xl mx-auto">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Cari unit apartemen..."
                  className="flex-1 px-6 py-4 rounded-l-lg focus:outline-none text-gray-900"
                />
                <Button
                  onClick={() => navigate('/apartments')}
                  className="rounded-l-none px-8"
                >
                  Cari
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Tentang Vida View
              </h2>
              <p className="text-gray-600 mb-4">
                VidaView Apartment merupakan pencakar unit residensial dan komersial yang membangun 2 tower dengan total 1,800 unit tipe unit apartemen disesuaikan dalam 1 tipe luas, total area bangunan menghabiskan seukuran 4 toko luas lahan dan menjual apartemen dilokasikan dekat 13 lot (food corner, GNC, BMC, dan 24 corner) dan meja dinas ke area komune untuk melakukan kegiatan-kegiatan umum untuk menopang kegiatan sertifikasinya project agamis dan lora, tenang menjadi.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">2</div>
                  <div className="text-sm text-gray-600">Tower</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">1,800+</div>
                  <div className="text-sm text-gray-600">Unit</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://vidaviewmakassar.com/wp-content/uploads/2025/02/Vidaview_Apartment_Floor_7_Outdoor_Park_and_Pool_19-resize-768x576.jpg"
                alt="Apartment"
                className="rounded-lg shadow-lg object-cover h-48"
              />
              <img
                src="https://vidaviewmakassar.com/wp-content/uploads/2025/02/Vidaview-Apartment_Floor-7_Outdoor-Park-and-Pool_16-768x576.jpg"
                alt="Apartment"
                className="rounded-lg shadow-lg object-cover h-48 mt-8"
              />
              <img
                src="https://images.trvl-media.com/lodging/102000000/101560000/101552100/101552011/baaf3a9d.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill"
                alt="Apartment"
                className="rounded-lg shadow-lg object-cover h-48"
              />
              <img
                src="https://vidaviewmakassar.com/wp-content/uploads/elementor/thumbs/Vidaview_Ruko-r7tiffo2kggqf60z3v81r2x8kso0p4u9icum2w3b74.webp"
                alt="Apartment"
                className="rounded-lg shadow-lg object-cover h-48 mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Fasilitas Premium
            </h2>
            <p className="text-gray-600">
              Nikmati berbagai fasilitas kelas dunia untuk kenyamanan Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                  <feature.icon className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.name}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Lokasi Strategis
              </h2>
              <p className="text-gray-600 mb-6">
                Berada di puncak kota dengan akses mudah ke berbagai tempat
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPinIcon className="h-6 w-6 text-purple-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Alamat</h4>
                    <p className="text-gray-600 text-sm">
                      Jl. Topaz Raya<br />
                      Masale, Panakkukang<br />
                      Kota Makassar, Sulawesi Selatan 90215
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <Button 
                  onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=-5.15502298300159,119.44139523808344', '_blank')}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Buka di Google Maps
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('https://www.google.com/maps/dir/?api=1&destination=-5.15502298300159,119.44139523808344', '_blank')}
                >
                  Dapatkan Arah
                </Button>
              </div>
            </div>
            <div className="h-96 bg-gray-200 rounded-lg overflow-hidden shadow-lg">
              {/* Map placeholder */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d1299.4816185353466!2d119.44139523808344!3d-5.15502298300159!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1svida%20view!5e1!3m2!1sid!2sid!4v1762091008318!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps Vida View Apartment"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Apa Kata Penyewa Kami</h2>
            <p className="text-gray-300">
              Pengalaman nyata dari penyewa yang tinggal di Vida View
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6"
              >
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-5 w-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-200 mb-4">{testimonial.comment}</p>
                <p className="font-semibold">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Siap Untuk Pindah?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Temukan unit apartemen impian Anda sekarang juga
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" onClick={() => navigate('/apartments')}>
              Lihat Unit Tersedia
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/contact')}
            >
              Hubungi Kami
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;