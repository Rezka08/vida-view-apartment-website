import React from 'react';
import { 
  WifiIcon,
  BoltIcon,
  HomeIcon,
  FireIcon,
  TruckIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const FacilityList = ({ facilities = [], layout = 'grid' }) => {
  if (!facilities || facilities.length === 0) {
    return (
      <div className="text-gray-500 text-sm">Tidak ada fasilitas yang tercantum</div>
    );
  }

  // Icon mapping untuk fasilitas umum
  const getIcon = (facilityName) => {
    const name = facilityName.toLowerCase();
    
    if (name.includes('wifi') || name.includes('internet')) {
      return <WifiIcon className="h-5 w-5" />;
    }
    if (name.includes('ac') || name.includes('pendingin')) {
      return <BoltIcon className="h-5 w-5" />;
    }
    if (name.includes('kitchen') || name.includes('dapur')) {
      return <HomeIcon className="h-5 w-5" />;
    }
    if (name.includes('water') || name.includes('air')) {
      return <FireIcon className="h-5 w-5" />;
    }
    if (name.includes('parkir') || name.includes('parking')) {
      return <TruckIcon className="h-5 w-5" />;
    }
    if (name.includes('keamanan') || name.includes('security')) {
      return <ShieldCheckIcon className="h-5 w-5" />;
    }
    
    return <HomeIcon className="h-5 w-5" />;
  };

  if (layout === 'list') {
    return (
      <div className="space-y-2">
        {facilities.map((item, index) => {
          const facility = item.facility || item;
          return (
            <div
              key={facility.id || index}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="text-purple-600">
                {getIcon(facility.name)}
              </div>
              <div>
                <p className="font-medium text-gray-900">{facility.name}</p>
                {facility.description && (
                  <p className="text-sm text-gray-500">{facility.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Grid layout (default)
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {facilities.map((item, index) => {
        const facility = item.facility || item;
        return (
          <div
            key={facility.id || index}
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg text-center hover:bg-purple-50 transition-colors"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2 text-purple-600">
              {getIcon(facility.name)}
            </div>
            <p className="font-medium text-gray-900 text-sm">{facility.name}</p>
            {facility.description && (
              <p className="text-xs text-gray-500 mt-1">{facility.description}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FacilityList;