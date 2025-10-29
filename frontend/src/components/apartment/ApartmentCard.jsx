import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  HomeIcon,
  BanknotesIcon,
  HeartIcon as HeartOutline
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { formatCurrency } from '../../utils/formatters';
import Badge from '../common/Badge';

const ApartmentCard = ({ 
  apartment, 
  onFavoriteToggle,
  isFavorite = false,
  showFavorite = true 
}) => {
  const coverPhoto = apartment.photos?.find(p => p.is_cover)?.photo_url || 
                     apartment.photos?.[0]?.photo_url || 
                     '/placeholder-apartment.jpg';

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(apartment.id);
    }
  };

  return (
    <Link to={`/apartments/${apartment.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        {/* Image */}
        <div className="relative h-48 bg-gray-200">
          <img
            src={coverPhoto}
            alt={apartment.unit_number}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/placeholder-apartment.jpg';
            }}
          />
          
          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <Badge 
              status={apartment.availability_status}
              variant={apartment.availability_status === 'available' ? 'success' : 'default'}
            >
              {apartment.availability_status === 'available' ? 'Tersedia' : 'Terisi'}
            </Badge>
          </div>

          {/* Favorite Button */}
          {showFavorite && (
            <button
              onClick={handleFavoriteClick}
              className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors"
            >
              {isFavorite ? (
                <HeartSolid className="h-6 w-6 text-red-500" />
              ) : (
                <HeartOutline className="h-6 w-6 text-gray-600" />
              )}
            </button>
          )}

          {/* Rating */}
          {apartment.avg_rating > 0 && (
            <div className="absolute bottom-3 left-3 bg-white px-2 py-1 rounded-lg shadow-md">
              <div className="flex items-center space-x-1">
                <span className="text-yellow-400">★</span>
                <span className="text-sm font-semibold">{apartment.avg_rating}</span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Unit Number & Type */}
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Unit {apartment.unit_number}
              </h3>
              <p className="text-sm text-gray-500">{apartment.unit_type}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-purple-600">
                {formatCurrency(apartment.price_per_month)}
              </p>
              <p className="text-xs text-gray-500">/bulan</p>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-3 gap-2 mb-3 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <HomeIcon className="h-4 w-4" />
              <span>{apartment.bedrooms} KT</span>
            </div>
            <div className="flex items-center space-x-1">
              <HomeIcon className="h-4 w-4" />
              <span>{apartment.bathrooms} KM</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPinIcon className="h-4 w-4" />
              <span>{apartment.size_sqm}m²</span>
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-1 mb-3">
            {apartment.furnished && (
              <span className="px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded-full">
                Furnished
              </span>
            )}
            {apartment.parking_slots > 0 && (
              <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
                Parkir
              </span>
            )}
            {apartment.pet_friendly && (
              <span className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full">
                Pet Friendly
              </span>
            )}
          </div>

          {/* Floor & View */}
          {(apartment.floor || apartment.view_direction) && (
            <div className="text-xs text-gray-500">
              {apartment.floor && <span>Lantai {apartment.floor}</span>}
              {apartment.floor && apartment.view_direction && <span> • </span>}
              {apartment.view_direction && <span>View {apartment.view_direction}</span>}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ApartmentCard;