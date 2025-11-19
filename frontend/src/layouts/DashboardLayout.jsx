import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  CreditCardIcon,
  DocumentTextIcon,
  UserIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  UsersIcon,
  BellIcon,
  TagIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../stores/authStore';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Define navigation items based on role
  const getNavigation = () => {
    if (!user) return [];

    // Dashboard item with correct href for each role
    const dashboardHref = user.role === 'tenant' ? '/dashboard' : `/${user.role}/dashboard`;
    const commonItems = [
      { name: 'Dashboard', href: dashboardHref, icon: HomeIcon },
    ];

    const roleSpecificItems = {
      admin: [
        { name: 'Kelola User', href: '/admin/users', icon: UsersIcon },
        { name: 'Kelola Booking', href: '/admin/bookings', icon: CalendarIcon },
        { name: 'Verifikasi Pembayaran', href: '/admin/payments', icon: CreditCardIcon },
        { name: 'Kelola Promosi', href: '/admin/promotions', icon: TagIcon },
        { name: 'Laporan', href: '/admin/reports', icon: ChartBarIcon },
      ],
      owner: [
        { name: 'Kelola Unit', href: '/owner/units', icon: BuildingOfficeIcon },
        { name: 'Booking', href: '/owner/bookings', icon: CalendarIcon },
        { name: 'Laporan Keuangan', href: '/owner/financial', icon: ChartBarIcon },
      ],
      tenant: [
        { name: 'Cari Unit', href: '/apartments', icon: BuildingOfficeIcon },
        { name: 'Booking Saya', href: '/my-bookings', icon: CalendarIcon },
        { name: 'Pembayaran', href: '/my-payments', icon: CreditCardIcon },
        { name: 'Dokumen', href: '/my-documents', icon: DocumentTextIcon },
      ]
    };

    const profileItems = [
      { name: 'Profil', href: '/profile', icon: UserIcon },
    ];

    return [
      ...commonItems,
      ...(roleSpecificItems[user.role] || []),
      ...profileItems
    ];
  };

  const navigation = getNavigation();

  const isActive = (href) => location.pathname === href || location.pathname.startsWith(href + '/');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/img/logo.png" 
                alt="Vida View Logo" 
                className="h-28 w-auto"
              />
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* User info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              {user?.profile_photo ? (
                <img
                  src={user.profile_photo}
                  alt={user.full_name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-600 font-semibold">
                    {user?.full_name?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.full_name}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-2 py-4">
            <ul className="space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-purple-50 text-purple-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <svg
                className="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Keluar
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            <div className="flex items-center space-x-4 ml-auto">
              <Link
                to="/notifications"
                className="relative p-2 text-gray-600 hover:text-purple-600 rounded-lg hover:bg-gray-100"
              >
                <BellIcon className="h-6 w-6" />
                {/* Notification badge would go here */}
              </Link>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;