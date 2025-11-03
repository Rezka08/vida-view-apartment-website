import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  BanknotesIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import adminAPI from '../../api/admin';
import Chart from '../../components/dashboard/Chart';
import StatsCard from '../../components/dashboard/StatsCard';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { formatCurrency } from '../../utils/formatters';

const FinancialReport = () => {
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [reportData, setReportData] = useState(null);
  const [revenueChart, setRevenueChart] = useState([]);
  const [occupancyData, setOccupancyData] = useState(null);

  useEffect(() => {
    fetchReportData();
  }, [selectedYear, selectedMonth]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      // Fetch revenue data
      const revenueResponse = await adminAPI.getRevenueReport({ year: selectedYear });
      
      // Prepare chart data
      const monthlyData = Object.entries(revenueResponse.monthly_data || {}).map(([month, value]) => ({
        label: getMonthName(parseInt(month)),
        value: value
      }));
      setRevenueChart(monthlyData);

      // Fetch occupancy data
      const occupancyResponse = await adminAPI.getOccupancyReport();
      setOccupancyData(occupancyResponse);

      // Set report data
      setReportData({
        totalRevenue: revenueResponse.total_revenue || 0,
        monthlyRevenue: revenueResponse.monthly_data?.[selectedMonth] || 0,
        totalBookings: 0, // Mock data
        activeUnits: occupancyResponse?.summary?.occupied || 0,
        occupancyRate: occupancyResponse?.summary?.occupancy_rate || 0
      });
    } catch (error) {
      toast.error('Gagal memuat laporan keuangan');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (month) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
    return months[month - 1];
  };

  const handleExport = (format) => {
    toast(`Export ${format.toUpperCase()} akan segera tersedia`, { icon: 'ℹ️' });
  };

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: getMonthName(i + 1)
  }));

  if (loading) {
    return <Loading fullScreen text="Memuat laporan..." />;
  }

  const calculateGrowth = () => {
    if (!revenueChart || revenueChart.length < 2) return 0;
    const currentMonth = revenueChart[selectedMonth - 1]?.value || 0;
    const previousMonth = revenueChart[selectedMonth - 2]?.value || 0;
    if (previousMonth === 0) return 0;
    return ((currentMonth - previousMonth) / previousMonth * 100).toFixed(1);
  };

  const growth = calculateGrowth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laporan Keuangan</h1>
          <p className="text-gray-600">Analisis pendapatan dan kinerja unit</p>
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

      {/* Period Selector */}
      <Card>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Periode:</span>
          </div>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Pendapatan Bulan Ini"
          value={formatCurrency(reportData?.monthlyRevenue || 0)}
          icon={BanknotesIcon}
          change={parseFloat(growth)}
          changeType={growth >= 0 ? 'positive' : 'negative'}
        />
        <StatsCard
          title="Pendapatan Tahun Ini"
          value={formatCurrency(reportData?.totalRevenue || 0)}
          icon={BanknotesIcon}
        />
        <StatsCard
          title="Unit Aktif"
          value={reportData?.activeUnits || 0}
          icon={ChartBarIcon}
          subtitle={`${reportData?.occupancyRate}% Occupancy`}
        />
        <StatsCard
          title="Total Booking"
          value={reportData?.totalBookings || 0}
          icon={CalendarIcon}
        />
      </div>

      {/* Revenue Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title={`Pendapatan ${selectedYear}`}>
          {revenueChart.length > 0 ? (
            <Chart
              data={revenueChart}
              title=""
              type="bar"
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              <p>Tidak ada data</p>
            </div>
          )}
        </Card>

        <Card title="Ringkasan Keuangan">
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-800 font-medium">Total Pendapatan</span>
                <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-900">
                {formatCurrency(reportData?.totalRevenue || 0)}
              </p>
              <p className="text-sm text-green-700 mt-1">Tahun {selectedYear}</p>
            </div>

            <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-800 font-medium">Rata-rata Bulanan</span>
                <ChartBarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-900">
                {formatCurrency((reportData?.totalRevenue || 0) / 12)}
              </p>
              <p className="text-sm text-blue-700 mt-1">Per bulan di {selectedYear}</p>
            </div>

            <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-purple-800 font-medium">Occupancy Rate</span>
                <ChartBarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-900">
                {reportData?.occupancyRate || 0}%
              </p>
              <p className="text-sm text-purple-700 mt-1">
                {reportData?.activeUnits} dari total unit terisi
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Occupancy by Unit Type */}
      {occupancyData?.by_type && (
        <Card title="Okupansi per Tipe Unit">
          <div className="space-y-4">
            {Object.entries(occupancyData.by_type).map(([type, data]) => (
              <div key={type} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{type}</span>
                  <span className="text-sm text-gray-600">
                    {data.occupied}/{data.total} unit ({Math.round((data.occupied / data.total) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(data.occupied / data.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Monthly Breakdown */}
      <Card title="Breakdown Bulanan">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Bulan
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Pendapatan
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Growth
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {revenueChart.map((month, index) => {
                const prevValue = index > 0 ? revenueChart[index - 1].value : month.value;
                const growthRate = prevValue > 0 ? ((month.value - prevValue) / prevValue * 100).toFixed(1) : 0;
                
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {month.label}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                      {formatCurrency(month.value)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <span className={`inline-flex items-center ${
                        growthRate >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {growthRate >= 0 ? (
                          <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                        ) : (
                          <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                        )}
                        {Math.abs(growthRate)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        month.value > 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {month.value > 0 ? 'Active' : 'No Data'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  Total
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-purple-600">
                  {formatCurrency(reportData?.totalRevenue || 0)}
                </td>
                <td colSpan="2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* Performance Insights */}
      <Card title="Insights & Rekomendasi">
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
              <ArrowTrendingUpIcon className="h-5 w-5 mr-2" />
              Performance Summary
            </h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Pendapatan bulan ini {growth >= 0 ? 'meningkat' : 'menurun'} sebesar {Math.abs(growth)}% dibanding bulan lalu</li>
              <li>• Occupancy rate saat ini {reportData?.occupancyRate}% dengan {reportData?.activeUnits} unit aktif</li>
              <li>• Rata-rata pendapatan per bulan: {formatCurrency((reportData?.totalRevenue || 0) / 12)}</li>
            </ul>
          </div>

          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">Rekomendasi</h4>
            <ul className="space-y-2 text-sm text-green-800">
              <li>• Pertimbangkan untuk menaikkan harga unit yang memiliki occupancy rate tinggi</li>
              <li>• Promosikan unit yang masih kosong dengan special offer</li>
              <li>• Tingkatkan kualitas layanan untuk mempertahankan penyewa existing</li>
              <li>• Monitor market trend untuk penyesuaian harga yang kompetitif</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FinancialReport;