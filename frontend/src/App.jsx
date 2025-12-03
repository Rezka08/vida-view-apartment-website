import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'

// Layouts
import MainLayout from './layouts/MainLayout'
import DashboardLayout from './layouts/DashboardLayout'

// Public Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Facilities from './pages/Facilities'
import Location from './pages/Location'
import ApartmentList from './pages/apartments/ApartmentList'
import ApartmentDetail from './pages/apartments/ApartmentDetail'

// Tenant Pages
import TenantDashboard from './pages/tenant/TenantDashboard'
import MyBookings from './pages/tenant/MyBookings'
import MyPayments from './pages/tenant/MyPayments'
import MyDocuments from './pages/tenant/MyDocuments'
import TenantProfile from './pages/tenant/TenantProfile'
import FavoriteList from './pages/apartments/FavoriteList'

// Owner Pages
import OwnerDashboard from './pages/owner/OwnerDashboard'
import MyUnits from './pages/owner/MyUnits'
import UnitBookings from './pages/owner/UnitBookings'
import FinancialReport from './pages/owner/FinancialReport'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import UserManagement from './pages/admin/UserManagement'
import BookingManagement from './pages/admin/BookingManagement'
import PaymentVerification from './pages/admin/PaymentVerification'
import PromotionManagement from './pages/admin/PromotionManagement'
import Reports from './pages/admin/Reports'

// Booking Pages
import BookingForm from './pages/booking/BookingForm'
import BookingPayment from './pages/booking/BookingPayment'
import BookingSuccess from './pages/booking/BookingSuccess'

// Shared Pages
import Notifications from './pages/Notifications'

// Route Guards
import ProtectedRoute from './routes/ProtectedRoute'
import RoleRoute from './routes/RoleRoute'

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/facilities" element={<Facilities />} />
        <Route path="/location" element={<Location />} />
        <Route path="/apartments" element={<ApartmentList />} />
        <Route path="/apartments/:id" element={<ApartmentDetail />} />
      </Route>

      {/* Protected Routes - Tenant */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={
          <RoleRoute allowedRoles={['tenant']}>
            <TenantDashboard />
          </RoleRoute>
        } />
        <Route path="/my-bookings" element={
          <RoleRoute allowedRoles={['tenant']}>
            <MyBookings />
          </RoleRoute>
        } />
        <Route path="/my-payments" element={
          <RoleRoute allowedRoles={['tenant']}>
            <MyPayments />
          </RoleRoute>
        } />
        <Route path="/my-documents" element={
          <RoleRoute allowedRoles={['tenant']}>
            <MyDocuments />
          </RoleRoute>
        } />
        <Route path="/favorites" element={
          <RoleRoute allowedRoles={['tenant']}>
            <FavoriteList />
          </RoleRoute>
        } />
        <Route path="/profile" element={
          <RoleRoute allowedRoles={['tenant', 'owner', 'admin']}>
            <TenantProfile />
          </RoleRoute>
        } />
        <Route path="/notifications" element={
          <RoleRoute allowedRoles={['tenant', 'owner', 'admin']}>
            <Notifications />
          </RoleRoute>
        } />

        {/* Booking Flow */}
        <Route path="/booking/:apartmentId" element={
          <RoleRoute allowedRoles={['tenant']}>
            <BookingForm />
          </RoleRoute>
        } />
        <Route path="/booking/:bookingId/payment" element={
          <RoleRoute allowedRoles={['tenant']}>
            <BookingPayment />
          </RoleRoute>
        } />
        <Route path="/booking/success" element={
          <RoleRoute allowedRoles={['tenant']}>
            <BookingSuccess />
          </RoleRoute>
        } />
      </Route>

      {/* Protected Routes - Owner */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/owner/dashboard" element={
          <RoleRoute allowedRoles={['owner']}>
            <OwnerDashboard />
          </RoleRoute>
        } />
        <Route path="/owner/units" element={
          <RoleRoute allowedRoles={['owner']}>
            <MyUnits />
          </RoleRoute>
        } />
        <Route path="/owner/bookings" element={
          <RoleRoute allowedRoles={['owner']}>
            <UnitBookings />
          </RoleRoute>
        } />
        <Route path="/owner/financial" element={
          <RoleRoute allowedRoles={['owner']}>
            <FinancialReport />
          </RoleRoute>
        } />
        <Route path="/owner/payments" element={
          <RoleRoute allowedRoles={['owner']}>
            <PaymentVerification />
          </RoleRoute>
        } />
        <Route path="/profile" element={
          <RoleRoute allowedRoles={['tenant', 'owner', 'admin']}>
            <TenantProfile />
          </RoleRoute>
        } />
      </Route>

      {/* Protected Routes - Admin */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/admin/dashboard" element={
          <RoleRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </RoleRoute>
        } />
        <Route path="/admin/users" element={
          <RoleRoute allowedRoles={['admin']}>
            <UserManagement />
          </RoleRoute>
        } />
        <Route path="/admin/bookings" element={
          <RoleRoute allowedRoles={['admin']}>
            <BookingManagement />
          </RoleRoute>
        } />
        <Route path="/admin/payments" element={
          <RoleRoute allowedRoles={['admin']}>
            <PaymentVerification />
          </RoleRoute>
        } />
        <Route path="/admin/promotions" element={
          <RoleRoute allowedRoles={['admin']}>
            <PromotionManagement />
          </RoleRoute>
        } />
        <Route path="/admin/reports" element={
          <RoleRoute allowedRoles={['admin']}>
            <Reports />
          </RoleRoute>
        } />
        <Route path="/profile" element={
          <RoleRoute allowedRoles={['tenant', 'owner', 'admin']}>
            <TenantProfile />
          </RoleRoute>
        } />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App