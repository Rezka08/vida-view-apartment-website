import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import Button from '../common/Button';

const ApartmentFilters = ({ onFilterChange, onSearch }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    unit_type: '',
    min_price: '',
    max_price: '',
    bedrooms: '',
    furnished: '',
    status: 'available'
  });

  const unitTypes = ['Studio', '1BR', '2BR', '3BR', 'Penthouse'];
  const bedroomOptions = [1, 2, 3, 4];

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    
    // Debounce untuk search, langsung untuk filter lainnya
    if (name === 'search') {
      // Will be handled by search button
    } else {
      onFilterChange && onFilterChange(newFilters);
    }
  };

  const handleSearch = () => {
    onSearch && onSearch(filters.search);
    onFilterChange && onFilterChange(filters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      unit_type: '',
      min_price: '',
      max_price: '',
      bedrooms: '',
      furnished: '',
      status: 'available'
    };
    setFilters(clearedFilters);
    onFilterChange && onFilterChange(clearedFilters);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      {/* Search Bar */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="Cari berdasarkan nomor unit atau deskripsi..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        <Button onClick={handleSearch}>
          Cari
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
        >
          <AdjustmentsHorizontalIcon className="h-5 w-5" />
        </Button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Unit Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipe Unit
              </label>
              <select
                name="unit_type"
                value={filters.unit_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Semua Tipe</option>
                {unitTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kamar Tidur
              </label>
              <select
                name="bedrooms"
                value={filters.bedrooms}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Semua</option>
                {bedroomOptions.map(num => (
                  <option key={num} value={num}>{num} Kamar</option>
                ))}
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Harga Minimum
              </label>
              <input
                type="number"
                name="min_price"
                value={filters.min_price}
                onChange={handleChange}
                placeholder="Min. harga"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Harga Maksimum
              </label>
              <input
                type="number"
                name="max_price"
                value={filters.max_price}
                onChange={handleChange}
                placeholder="Max. harga"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Furnished */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Furnished
              </label>
              <select
                name="furnished"
                value={filters.furnished}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Semua</option>
                <option value="true">Ya</option>
                <option value="false">Tidak</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Semua Status</option>
                <option value="available">Tersedia</option>
                <option value="occupied">Terisi</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              Reset Filter
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApartmentFilters;