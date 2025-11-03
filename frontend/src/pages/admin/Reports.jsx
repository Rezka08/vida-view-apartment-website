import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { DocumentArrowDownIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import adminAPI from '../../api/admin';
import Chart from '../../components/dashboard/Chart';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { formatCurrency } from '../../utils/formatters';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [occupancyData, setOccupancyData] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [topApartments, setTopApartments] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchReports();
  }, [selectedYear]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const [occupancy, revenue, top] = await Promise.all([
        adminAPI.getOccupancyReport(),
        adminAPI.getRevenueReport({ year: selectedYear }),
        adminAPI.getTopApartments({ limit: 10 })
      ]);
      
      setOccupancyData(occupancy);
      setRevenueData(revenue);
      setTopApartments(top);
    } catch (error) {
      toast.error('Gagal memuat laporan');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (type) => {
    toast(`Export ${type} akan segera tersedia`, { icon: 'ℹ️' });
  };

  if (loading) return <Loading fullScreen text="Memuat laporan..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laporan</h1>
          <p className="text-gray-600">Analisis dan statistik sistem</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => handleExport('excel')}>
            <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Occupancy Report */}
      {occupancyData && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Laporan Okupansi</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Unit</p>
              <p className="text-3xl font-bold text-purple-600">{occupancyData.summary.total}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Terisi</p>
              <p className="text-3xl font-bold text-green-600">{occupancyData.summary.occupied}</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Tersedia</p>
              <p className="text-3xl font-bold text-blue-600">{occupancyData.summary.available}</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Tingkat Okupansi</p>
              <p className="text-3xl font-bold text-yellow-600">{occupancyData.summary.occupancy_rate}%</p>
            </div>
          </div>

          {/* By Type */}
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Okupansi per Tipe Unit</h3>
            <div className="space-y-3">
              {Object.entries(occupancyData.by_type).map(([type, data]) => (
                <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{type}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${(data.occupied / data.total) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm text-gray-600">{data.occupied}/{data.total}</p>
                    <p className="text-xs text-gray-500">
                      {Math.round((data.occupied / data.total) * 100)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Revenue Report */}
      {revenueData && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Laporan Pendapatan</h2>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {[2023, 2024, 2025].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-1">Total Pendapatan {selectedYear}</p>
            <p className="text-3xl font-bold text-purple-600">
              {formatCurrency(revenueData.total_revenue)}
            </p>
          </div>

          <Chart
            data={Object.entries(revenueData.monthly_data).map(([month, value]) => ({
              label: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'][month - 1],
              value: value
            }))}
            title="Pendapatan Bulanan"
            type="bar"
          />
        </div>
      )}

      {/* Top Apartments */}
      {topApartments && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Unit Terpopuler</h2>
          
          <div className="space-y-6">
            {/* Most Viewed */}
            <div>
              <h3 className="font-medium text-gray-700 mb-3">Paling Banyak Dilihat</h3>
              <div className="space-y-2">
                {topApartments.most_viewed.slice(0, 5).map((apt, index) => (
                  <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium">Unit {apt.unit_number}</p>
                        <p className="text-sm text-gray-500">{apt.unit_type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{apt.total_views}</p>
                      <p className="text-xs text-gray-500">views</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Highest Rated */}
            {topApartments.highest_rated.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Rating Tertinggi</h3>
                <div className="space-y-2">
                  {topApartments.highest_rated.slice(0, 5).map((apt, index) => (
                    <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-semibold">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium">Unit {apt.unit_number}</p>
                          <p className="text-sm text-gray-500">{apt.unit_type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">★ {apt.avg_rating}</p>
                        <p className="text-xs text-gray-500">rating</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;