import React, { useState } from 'react';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const ImageGallery = ({ photos = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!photos || photos.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Tidak ada foto tersedia</p>
      </div>
    );
  }

  const handlePrevious = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const openModal = (index) => {
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  return (
    <div>
      {/* Main Display */}
      <div className="relative">
        {/* Main Image */}
        <div
          className="relative h-96 rounded-lg overflow-hidden cursor-pointer"
          onClick={() => openModal(selectedIndex)}
        >
          <img
            src={photos[selectedIndex]?.photo_url || '/placeholder.jpg'}
            alt={photos[selectedIndex]?.caption || 'Apartment photo'}
            className="w-full h-full object-cover"
          />
          
          {/* Navigation Arrows */}
          {photos.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Counter */}
          <div className="absolute bottom-4 right-4 px-3 py-1 bg-black bg-opacity-60 text-white text-sm rounded-full">
            {selectedIndex + 1} / {photos.length}
          </div>

          {/* Photo Type Badge */}
          {photos[selectedIndex]?.photo_type && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-purple-600 text-white text-sm rounded-full capitalize">
              {photos[selectedIndex].photo_type.replace('_', ' ')}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {photos.length > 1 && (
          <div className="mt-4 grid grid-cols-5 gap-2">
            {photos.slice(0, 5).map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => setSelectedIndex(index)}
                className={`relative h-20 rounded-lg overflow-hidden ${
                  selectedIndex === index ? 'ring-2 ring-purple-600' : ''
                }`}
              >
                <img
                  src={photo.photo_url}
                  alt={photo.caption || `Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {photos.length > 5 && index === 4 && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white font-semibold">
                    +{photos.length - 5}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 z-10"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          {/* Navigation */}
          {photos.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 z-10"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 z-10"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Image */}
          <div className="max-w-7xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={photos[selectedIndex]?.photo_url}
              alt={photos[selectedIndex]?.caption}
              className="max-w-full max-h-[90vh] object-contain"
            />
            {photos[selectedIndex]?.caption && (
              <p className="text-white text-center mt-4">
                {photos[selectedIndex].caption}
              </p>
            )}
          </div>

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white bg-opacity-20 text-white rounded-full">
            {selectedIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;