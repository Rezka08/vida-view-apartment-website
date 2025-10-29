import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon 
} from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Tentang Kami', href: '/about' },
    { name: 'Unit Tersedia', href: '/apartments' },
    { name: 'Fasilitas', href: '/facilities' },
    { name: 'FAQ', href: '/faq' }
  ];

  const legalLinks = [
    { name: 'Syarat & Ketentuan', href: '/terms' },
    { name: 'Kebijakan Privasi', href: '/privacy' },
    { name: 'Kontak', href: '/contact' }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: 'facebook', href: '#' },
    { name: 'Instagram', icon: 'instagram', href: '#' },
    { name: 'Twitter', icon: 'twitter', href: '#' }
  ];

  return (
    <footer className="bg-gradient-to-r from-indigo-900 via-purple-900 to-purple-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-bold text-xl">VV</span>
              </div>
              <span className="text-xl font-bold">Vida View</span>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Apartemen modern dengan pemandangan terbaik di kota. Nikmati lifestyle urban yang nyaman dan strategis.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
                  aria-label={social.name}
                >
                  <span className="text-sm">{social.icon[0].toUpperCase()}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tautan Cepat</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontak</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPinIcon className="h-5 w-5 text-gray-300 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm">
                  Jl. Sudirman No. 123<br />
                  Jakarta Pusat, 10220
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <PhoneIcon className="h-5 w-5 text-gray-300 flex-shrink-0" />
                <a href="tel:+622112345678" className="text-gray-300 hover:text-white text-sm">
                  +62 21 1234 5678
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-gray-300 flex-shrink-0" />
                <a href="mailto:info@vidaview.com" className="text-gray-300 hover:text-white text-sm">
                  info@vidaview.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white border-opacity-20">
          <p className="text-center text-gray-300 text-sm">
            © {currentYear} Vida View. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;