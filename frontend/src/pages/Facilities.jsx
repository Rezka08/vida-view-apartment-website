import React, { useState } from 'react';
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
      imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop',
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
      imageUrl: 'https://i.pinimg.com/1200x/c7/32/14/c73214c6cb0c3236376fc0fcb4cd2801.jpg',
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
      imageUrl: 'https://i.pinimg.com/1200x/d7/fe/57/d7fe57af4ff2b78fb42550a84aba3d8e.jpg',
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
      imageUrl: 'https://i.pinimg.com/1200x/e9/33/57/e933578a19dba0ab2236a699ce6d1c38.jpg',
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
      imageUrl: 'https://i.pinimg.com/1200x/31/c5/6c/31c56c2c7baaa5c40216d70e9a6a86cd.jpg',
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
      imageUrl: 'https://i.pinimg.com/736x/2f/fc/e6/2ffce627954199c172bd5947d589da92.jpg',
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
      imageUrl: 'https://i.pinimg.com/736x/60/bd/39/60bd394c51249e65e1b1616e1a88ff79.jpg',
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
      imageUrl: 'https://vidaviewmakassar.com/wp-content/uploads/2025/02/Vidaview-Apartment_Floor-7_Outdoor-Park-and-Pool_16-768x576.jpg',
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
      imageUrl: 'https://i.pinimg.com/1200x/23/b6/56/23b65673022ec402a3c086990ca3895d.jpg',
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
      imageUrl: 'https://i.pinimg.com/736x/b1/15/f0/b115f092d16588bc949a447196a72a41.jpg',
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
      imageUrl: 'https://i.pinimg.com/736x/ee/d7/a5/eed7a53783f1fa0305ef775d241f35cc.jpg',
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
      imageUrl: 'https://i.pinimg.com/1200x/1d/2c/8d/1d2c8d96663d3c39bd9e14c961865bff.jpg',
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
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                {/* Card Header with Image */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <div className="absolute top-4 right-4 z-10">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${facility.badgeColor}`}>
                      {facility.badge}
                    </span>
                  </div>
                  <img 
                    src={facility.imageUrl} 
                    alt={facility.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=' + encodeURIComponent(facility.title);
                    }}
                  />
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
