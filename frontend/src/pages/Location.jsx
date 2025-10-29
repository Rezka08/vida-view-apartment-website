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
        { name: 'Stasiun MRT Bundaran HI', distance: '500 m', time: '5 menit jalan kaki' },
        { name: 'Halte TransJakarta Semanggi', distance: '300 m', time: '3 menit jalan kaki' },
        { name: 'Stasiun Gambir', distance: '4.5 km', time: '10 menit berkendara' },
        { name: 'Bandara Halim Perdanakusuma', distance: '14.3 km', time: '25 menit berkendara' }
      ]
    },
    {
      icon: ShoppingBagIcon,
      title: 'Shopping & Entertainment',
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-600',
      items: [
        { name: 'Plaza Indonesia', distance: '2.5 km', time: '8 menit berkendara' },
        { name: 'Grand Indonesia', distance: '2.6 km', time: '9 menit berkendara' },
        { name: 'Senayan City', distance: '3.1 km', time: '12 menit berkendara' },
        { name: 'Pacific Place', distance: '3.5 km', time: '14 menit berkendara' }
      ]
    },
    {
      icon: HeartIcon,
      title: 'Kesehatan',
      color: 'bg-red-50 border-red-200',
      iconColor: 'text-red-600',
      items: [
        { name: 'RS Siloam Semanggi', distance: '1.5 km', time: '5 menit berkendara' },
        { name: 'RS MMC', distance: '3.4 km', time: '12 menit berkendara' },
        { name: 'Klinik Kimia Farma', distance: '500 m', time: '3 menit jalan kaki' },
        { name: 'Apotek Guardian', distance: '200 m', time: '2 menit jalan kaki' }
      ]
    },
    {
      icon: AcademicCapIcon,
      title: 'Pendidikan',
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600',
      items: [
        { name: 'Universitas Indonesia', distance: '11 km', time: '22 menit berkendara' },
        { name: 'Binus University', distance: '6.2 km', time: '18 menit berkendara' },
        { name: 'SD Morning Star', distance: '1 km', time: '5 menit jalan kaki' },
        { name: 'TK & Daycare', distance: '500 m', time: '3 menit jalan kaki' }
      ]
    },
    {
      icon: BuildingOffice2Icon,
      title: 'Perkantoran',
      color: 'bg-indigo-50 border-indigo-200',
      iconColor: 'text-indigo-600',
      items: [
        { name: 'Sudirman Central Business District', distance: '3 km', time: '10 menit berkendara' },
        { name: 'Thamrin Business District', distance: '3.8 km', time: '12 menit berkendara' },
        { name: 'Kuningan Business District', distance: '4.5 km', time: '15 menit berkendara' },
        { name: 'Menara BCA', distance: '3.2 km', time: '11 menit berkendara' }
      ]
    }
  ];

  const transportRoutes = [
    {
      icon: MapPinIcon,
      title: 'Dari Bandara',
      color: 'bg-blue-50',
      routes: [
        {
          subtitle: 'Airport Rail Link ke Stasiun BNI City',
          duration: '30 menit',
          steps: [
            'Lanjut dengan taksi atau Grab menuju Vida View (5 menit)',
            'Total waktu perjalanan: sekitar 45 menit'
          ]
        }
      ]
    },
    {
      icon: TruckIcon,
      title: 'Dari Stasiun Gambir',
      color: 'bg-green-50',
      routes: [
        {
          subtitle: 'Naik taksi/online langsung (10 menit)',
          steps: [
            'Atau naik TransJakarta Koridor 1 ke Halte Semanggi',
            'Lanjut dengan taksi/online menuju Vida View (5 menit)',
            'Atau naik MRT dari Stasiun Gondangdia menuju Bundaran HI (5 menit)'
          ]
        }
      ]
    },
    {
      icon: BuildingOffice2Icon,
      title: 'Transportasi Umum',
      color: 'bg-purple-50',
      routes: [
        {
          subtitle: 'MRT: Turun di Bundaran HI',
          duration: '5 menit',
          steps: [
            'Lanjut dengan Grab/Gojek menuju Vida View',
            'TransJakarta: Turun di Halte Semanggi',
            'Lanjut dengan Grab/Gojek atau jalan kaki (3 menit) menuju Thamrin'
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
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center relative">
              <div className="text-center">
                <MapPinIcon className="h-20 w-20 text-purple-600 mx-auto mb-4" />
                <p className="text-gray-700 font-semibold text-lg mb-2">Vida View Apartment</p>
                <p className="text-gray-600 text-sm">
                  Jl. M.H. Thamrin No. 123, Jakarta Pusat 10350
                </p>
              </div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
                <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm flex items-center gap-2">
                  <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                  Buka di Google Maps
                </button>
                <button className="px-6 py-2 bg-white text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium text-sm">
                  Dapatkan Arah
                </button>
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
