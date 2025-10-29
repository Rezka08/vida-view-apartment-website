import React from 'react';

const Chart = ({ data, title, type = 'bar' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="h-64 flex items-center justify-center text-gray-400">
          Tidak ada data untuk ditampilkan
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-6">{title}</h3>
      
      {type === 'bar' && (
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">{item.label}</span>
                <span className="text-sm font-medium">{item.value.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {type === 'line' && (
        <div className="h-64 flex items-end justify-between space-x-2">
          {data.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="relative w-full">
                <div
                  className="w-full bg-purple-600 rounded-t transition-all duration-500"
                  style={{ height: `${(item.value / maxValue) * 200}px` }}
                />
              </div>
              <span className="text-xs text-gray-600 mt-2">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Chart;