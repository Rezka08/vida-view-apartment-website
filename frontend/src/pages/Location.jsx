import React from 'react';
import {
  MapPinIcon,
  BuildingStorefrontIcon,
  AcademicCapIcon,
  BuildingOffice2Icon,
  ShoppingBagIcon,
  HeartIcon,
  TruckIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';

const Location = () => {
  const navigate = useNavigate();

  const accessCategories = [
    {
      icon: TruckIcon,
      title: 'Transportasi',
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600',
      items: [
        { name: 'Bandar Udara Internasional Sultan Hasanuddin (UPG)', distance: '19,3 km', time: 'Sekitar 23 menit berkendara, terhubung langsung via jalan tol Insinyur Sutami.' },
        { name: 'Bus Station Toddopuli Makassar', distance: '3,7 km', time: 'Terminal/halte bus terdekat untuk transportasi dalam dan antar kota.' },
        { name: 'Terminal Daya', distance: '12 km', time: 'Terminal bus utama yang melayani rute regional di Sulawesi Selatan.' },
      ]
    },
    {
      icon: ShoppingBagIcon,
      title: 'Shopping & Entertainment',
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-600',
      items: [
        { name: 'Mall Panakkukang (MP)', distance: '4,1 km', time: 'Salah satu mal terbesar dan paling ramai di Makassar.' },
        { name: 'Trans Studio Mall Makassar', distance: '9,7 km', time: 'Mal gaya hidup modern yang terintegrasi dengan Trans Studio Theme Park, menawarkan hiburan lengkap.' },
      ]
    },
    {
      icon: HeartIcon,
      title: 'Kesehatan',
      color: 'bg-red-50 border-red-200',
      iconColor: 'text-red-600',
      items: [
        { name: 'Rumah Sakit Umum Cahaya Medika', distance: '483 m', time: 'Rumah sakit terdekat (sangat terjangkau, bahkan bisa jalan kaki sebentar).' },
        { name: 'KLINIK PRATAMA MAKODAM XIV/HSN', distance: '2,0 km', time: 'Klinik kesehatan dengan layanan 24 jam.' },
        { name: 'Primaya Hospital Makassar', distance: '5,2 km', time: 'Salah satu rumah sakit swasta besar dengan fasilitas lengkap.' },
      ]
    },
    {
      icon: AcademicCapIcon,
      title: 'Pendidikan',
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600',
      items: [
        { name: 'Universitas Hasanuddin (Unhas)', distance: '8,5 km', time: 'Universitas Hasanuddin (Unhas) adalah salah satu universitas negeri terbaik di Indonesia, berlokasi di Makassar.' },
        { name: 'Binus University', distance: '6,1 km', time: 'BINUS Learning Community Makassar adalah pusat dukungan akademik regional untuk BINUS University Online Learning (PJJ).' },
        { name: 'Institut Bisnis dan Keuangan Nitro', distance: '3,4 km', time: 'Institusi pendidikan fokus pada bisnis dan keuangan.' },
        { name: 'Universitas Negeri Makassar (UNM) Kampus 2', distance: '7 km', time: 'Salah satu universitas negeri terbesar di Sulawesi Selatan.' }
      ]
    },
    {
      icon: BuildingOffice2Icon,
      title: 'Perkantoran',
      color: 'bg-indigo-50 border-indigo-200',
      iconColor: 'text-indigo-600',
      items: [
        { name: 'Ruko Pettarani Plaza', distance: '4,7 km', time: 'Salah satu komplek ruko/perkantoran di jalur utama Jl. A. P. Pettarani.' },
        { name: 'Kompleks Business Centre III', distance: '4,8 km', time: 'Pusat bisnis dan perkantoran di kawasan Panakkukang.' },
        { name: 'Ruko PETTARANI BUSINESS CENTRE', distance: '5,6 km', time: 'Kawasan perkantoran terpadu di sepanjang Jl. A. P. Pettarani.' },
      ]
    }
  ];

  const transportRoutes = [
    {
    icon: MapPinIcon, // Ikon untuk Bandara
    title: 'Dari Bandara Sultan Hasanuddin (UPG)',
    color: 'bg-blue-50',
    routes: [
      {
        subtitle: 'Naik Taxi Bandara/Grab/Gojek langsung',
        duration: '45 - 60 menit',
        steps: [
          'Waktu perjalanan tergantung kondisi lalu lintas.'
        ]
      },
      {
        subtitle: 'Atau, Naik Bus Damri/Trans Mamminasata Bandara',
        duration: 'Sekitar 30 menit (ke Terminal Daya)',
        steps: [
          'Lanjut dengan Taxi/Grab/Gojek menuju Vida View (sekitar 30 menit lagi).'
        ]
      }
    ]
  },
  {
    icon: BuildingStorefrontIcon, // Ikon untuk Stasiun Kereta Api
    title: 'Dari Stasiun Kereta Api (Barombong/Maros)',
    color: 'bg-green-50',
    routes: [
      {
        subtitle: 'Naik Taxi/Grab/Gojek langsung menuju Vida View',
        steps: [
          'Waktu perjalanan bervariasi tergantung lokasi stasiun keberangkatan (e.g., dari Maros, sekitar 60 - 75 menit).'
        ]
      }
    ]
  },
  {
    icon: TruckIcon, // Ikon untuk Transportasi Umum
    title: 'Transportasi Umum',
    color: 'bg-purple-50',
    routes: [
      {
        subtitle: 'Trans Mamminasata (Koridor 1)',
        steps: [
          'Turun di Halte Mall Panakkukang.',
          'Lanjut dengan Grab/Gojek atau jalan kaki (sekitar 10-15 menit) menuju Vida View.'
        ]
      },
      {
        subtitle: 'Angkutan Kota (Pete-Pete) / Online',
        steps: [
          'Cari Pete-Pete yang melintasi Jalan Boulevard/Jalan Panakkukang.',
          'Turun di sekitar area Mall Panakkukang.',
          'Naik Grab/Gojek dari pusat kota (misalnya Losari) sekitar 20-30 menit.'
        ]
      }
    ]
  }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-purple-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm mb-4">
            Strategic Location
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Lokasi & Akses
          </h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto">
            Vida View terletak di lokasi yang strategis dengan akses mudah ke berbagai destinasi penting
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Map Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Peta Lokasi Vida View Apartment
          </h2>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="aspect-video bg-gray-200">
              {/* Google Maps Embed/Iframe */}
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

            <div className="p-6 bg-white border-t">
              <p className="text-center text-gray-700 font-semibold text-lg mb-2">Vida View Apartment</p>
              <p className="text-center text-gray-600 text-sm mb-4">
                Jl. Topaz Raya unit 16C, Masale, Kec. Panakkukang, Kota Makassar, Sulawesi Selatan 90215
              </p>
              <div className="flex gap-3 justify-center">
                {/* Tombol yang lebih interaktif */}
                <Button 
                  onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=Vida+View+Apartment+Makassar&query_place_id=ChIJddbYSERe-i0RS0o3TjF6T2s', '_blank')}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-1" />
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
          </div>
        </div>

        {/* Access Categories */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Akses ke Berbagai Destinasi
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Jelajahi kemudahan akses dari tempat Anda, mencari pendidikan, dan berbagai fasilitas penting lainnya
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {accessCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div key={index} className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border-2 ${category.color}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-lg ${category.color}`}>
                      <Icon className={`h-6 w-6 ${category.iconColor}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {category.title}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {category.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between items-start pb-3 border-b border-gray-100 last:border-0">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                        </div>
                        <span className="text-sm font-semibold text-gray-600 ml-4">{item.distance}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transport Routes */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Cara Menuju Vida View
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Panduan rute untuk mencapai kami dari berbagai titik di Jakarta
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {transportRoutes.map((route, index) => {
              const Icon = route.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                  <div className={`w-12 h-12 ${route.color} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {route.title}
                  </h3>
                  {route.routes.map((r, idx) => (
                    <div key={idx} className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">{r.subtitle}</p>
                        {r.duration && (
                          <p className="text-xs text-gray-500 mb-2">{r.duration}</p>
                        )}
                      </div>
                      <ul className="space-y-2">
                        {r.steps.map((step, stepIdx) => (
                          <li key={stepIdx} className="text-sm text-gray-600 flex items-start">
                            <span className="text-purple-600 mr-2">•</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-purple-800 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Kunjungi Vida View
          </h2>
          <p className="text-lg text-purple-100 mb-8 max-w-2xl mx-auto">
            Jadwalkan kunjungan Anda untuk melihat langsung lokasi strategis dan kemudahan akses yang kami tawarkan
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/apartments')}
              className="bg-white text-purple-600 hover:bg-gray-100 border-0"
            >
              Lihat Unit Tersedia
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={() => window.open('tel:+622112345678')}
              className="bg-purple-900 hover:bg-purple-950"
            >
              Hubungi Kami
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Location;
