import React, { useState } from 'react';
import {
  WifiIcon,
  TvIcon,
  HomeModernIcon,
  FireIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TruckIcon,
  SwatchIcon
} from '@heroicons/react/24/outline';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';

const Facilities = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'Semua Fasilitas' },
    { id: 'olahraga', label: 'Olahraga & Fitness' },
    { id: 'keamanan', label: 'Keamanan' },
    { id: 'komunitas', label: 'Komunitas' },
    { id: 'rekreasi', label: 'Rekreasi' },
    { id: 'wellness', label: 'Wellness' },
    { id: 'teknologi', label: 'Teknologi' },
    { id: 'sosial', label: 'Sosial' },
    { id: 'minimarket', label: 'Minimarket' },
    { id: 'cafe', label: 'Cafe & Lounge' }
  ];

  const facilities = [
    {
      icon: HomeModernIcon,
      title: 'Fitness Center',
      category: 'olahraga',
      badge: 'Olahraga & Fitness',
      badgeColor: 'bg-blue-100 text-blue-800',
      description: 'Gym modern dengan peralatan terlengkap untuk latihan profesional',
      features: [
        'Alat kardio terbaru',
        'Free weights',
        'Personal trainer',
        'Ruang yoga'
      ],
      color: 'purple'
    },
    {
      icon: FireIcon,
      title: 'Swimming Pool',
      category: 'olahraga',
      badge: 'Olahraga & Fitness',
      badgeColor: 'bg-blue-100 text-blue-800',
      description: 'Kolam renang outdoor dengan pemandangan kota yang menakjubkan',
      features: [
        'Kolam dewasa 25m',
        'Kolam anak',
        'Jacuzzi',
        'Pool bar'
      ],
      color: 'cyan'
    },
    {
      icon: TruckIcon,
      title: 'Shopping Arcade',
      category: 'komunitas',
      badge: 'Komunitas',
      badgeColor: 'bg-green-100 text-green-800',
      description: 'Area retail yang menyediakan berbagai keperluan sehari-hari',
      features: [
        'Minimarket 24 jam',
        'Kafe & restoran',
        'Laundry',
        'ATM center'
      ],
      color: 'green'
    },
    {
      icon: TruckIcon,
      title: 'Parking Area',
      category: 'keamanan',
      badge: 'Keamanan',
      badgeColor: 'bg-red-100 text-red-800',
      description: 'Area parkir luas dengan sistem keamanan terintegrasi',
      features: [
        'Parkir basement',
        'CCTV 24/7',
        'Akses kartu',
        'EV charging'
      ],
      color: 'gray'
    },
    {
      icon: ShieldCheckIcon,
      title: '24/7 Security',
      category: 'keamanan',
      badge: 'Keamanan',
      badgeColor: 'bg-red-100 text-red-800',
      description: 'Sistem keamanan berlapis dengan petugas profesional',
      features: [
        'Security 24 jam',
        'CCTV area publik',
        'Access card',
        'Security patrol'
      ],
      color: 'red'
    },
    {
      icon: WifiIcon,
      title: 'High-Speed Internet',
      category: 'teknologi',
      badge: 'Teknologi',
      badgeColor: 'bg-purple-100 text-purple-800',
      description: 'Koneksi internet fiber optic hingga 100 Mbps untuk semua unit',
      features: [
        'WiFi area publik',
        'Smart building',
        'Digital signage',
        'Mobile app'
      ],
      color: 'indigo'
    },
    {
      icon: UserGroupIcon,
      title: 'Function Hall',
      category: 'sosial',
      badge: 'Komunitas',
      badgeColor: 'bg-yellow-100 text-yellow-800',
      description: 'Ruang serbaguna untuk acara dan gathering',
      features: [
        'Kapasitas 100 orang',
        'Audio system',
        'Projector',
        'Catering service'
      ],
      color: 'yellow'
    },
    {
      icon: SparklesIcon,
      title: 'Sky Garden',
      category: 'rekreasi',
      badge: 'Rekreasi',
      badgeColor: 'bg-green-100 text-green-800',
      description: 'Taman atap dengan pemandangan luas 360 derajat',
      features: [
        'Jogging track',
        'Kids playground',
        'BBQ area',
        'Gazebo'
      ],
      color: 'green'
    },
    {
      icon: SwatchIcon,
      title: 'Food Court',
      category: 'sosial',
      badge: 'Komunitas',
      badgeColor: 'bg-orange-100 text-orange-800',
      description: 'Food court dengan berbagai pilihan makanan',
      features: [
        '10+ tenant F&B',
        'Outdoor seating',
        'Delivery service',
        'Healthy options'
      ],
      color: 'orange'
    },
    {
      icon: UserGroupIcon,
      title: "Children's Playground",
      category: 'rekreasi',
      badge: 'Rekreasi',
      badgeColor: 'bg-pink-100 text-pink-800',
      description: 'Area bermain anak yang aman dan menyenangkan',
      features: [
        'Playground modern',
        'Indoor play area',
        'Kids pool',
        'Safety certified'
      ],
      color: 'pink'
    },
    {
      icon: FireIcon,
      title: 'Cafe & Lounge',
      category: 'cafe',
      badge: 'Cafe & Lounge',
      badgeColor: 'bg-purple-100 text-purple-800',
      description: 'Fasilitas cafe dan lounge untuk bersantai',
      features: [
        'Cafe dengan menu sehat',
        'Co-working space',
        'Live music',
        'Comfortable seating'
      ],
      color: 'purple'
    },
    {
      icon: SparklesIcon,
      title: 'Indomaret 24/7',
      category: 'Minimarket',
      badge: 'Minimarket',
      badgeColor: 'bg-blue-100 text-blue-800',
      description: 'Minimarket yang buka 24 jam untuk kebutuhan sehari-hari',
      features: [
        'Snacks & beverages',
        'Kebutuhan rumah tangga',
        'Fresh air circulation',
        ''
      ],
      color: 'blue'
    }
  ];

  const filteredFacilities = activeCategory === 'all'
    ? facilities
    : facilities.filter(f => f.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-purple-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm mb-4">
            Premium Facilities
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Fasilitas Vida View
          </h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto">
            Nikmati berbagai fasilitas premium yang dirancang untuk kenyamanan dan gaya hidup modern Anda
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex space-x-2 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredFacilities.map((facility, index) => {
            const Icon = facility.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                {/* Card Header with Icon */}
                <div className="relative h-48 bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${facility.badgeColor}`}>
                      {facility.badge}
                    </span>
                  </div>
                  <Icon className="h-24 w-24 text-purple-400" />
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {facility.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {facility.description}
                  </p>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Fitur Unggulan:</h4>
                    <ul className="space-y-1">
                      {facility.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start">
                          <span className="text-purple-600 mr-2">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-purple-800 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Tertarik dengan Fasilitas Kami?
          </h2>
          <p className="text-lg text-purple-100 mb-8 max-w-2xl mx-auto">
            Jadwalkan kunjungan Anda untuk melihat langsung semua fasilitas premium yang kami tawarkan
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
              onClick={() => navigate('/location')}
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

export default Facilities;
