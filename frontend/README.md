# Vida View Frontend - React + Vite

Frontend aplikasi Vida View Apartment menggunakan React 18 dengan Vite sebagai build tool.

## 🚀 Tech Stack

- **React 18** - UI Library
- **Vite** - Build tool & dev server
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Zustand** - State management
- **React Query** - Server state management
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

## 📦 Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` file:
```env
VITE_API_URL=http://localhost:5001/api
VITE_UPLOAD_URL=http://localhost:5001/uploads
```

### 3. Run Development Server

```bash
npm run dev
```

Application will run on `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

Built files will be in `dist/` directory.

## 📁 Project Structure

```
src/
├── main.jsx              # Entry point
├── App.jsx               # Main app component with routes
├── index.css             # Global styles
│
├── api/                  # API layer
│   ├── axios.js          # Axios instance with interceptors
│   ├── auth.js           # Auth API calls
│   ├── apartments.js     # Apartment API calls
│   ├── bookings.js       # Booking API calls
│   ├── payments.js       # Payment API calls
│   └── users.js          # User API calls
│
├── stores/               # State management (Zustand)
│   ├── authStore.js      # Authentication state
│   ├── userStore.js      # User state
│   └── notificationStore.js  # Notification state
│
├── routes/               # Route configuration
│   ├── ProtectedRoute.jsx    # Auth guard
│   └── RoleRoute.jsx         # Role-based guard
│
├── layouts/              # Layout components
│   ├── MainLayout.jsx        # Main layout (public pages)
│   ├── DashboardLayout.jsx   # Dashboard layout
│   ├── Navbar.jsx            # Navigation bar
│   └── Footer.jsx            # Footer
│
├── pages/                # Page components
│   ├── Home.jsx              # Landing page
│   ├── Login.jsx             # Login page
│   ├── Register.jsx          # Register page
│   │
│   ├── apartments/
│   │   ├── ApartmentList.jsx     # Browse apartments
│   │   ├── ApartmentDetail.jsx   # Apartment details
│   │   └── FavoriteList.jsx      # Favorites
│   │
│   ├── tenant/               # Tenant pages
│   │   ├── TenantDashboard.jsx
│   │   ├── MyBookings.jsx
│   │   ├── MyPayments.jsx
│   │   ├── MyDocuments.jsx
│   │   └── TenantProfile.jsx
│   │
│   ├── owner/                # Owner pages
│   │   ├── OwnerDashboard.jsx
│   │   ├── MyUnits.jsx
│   │   ├── UnitBookings.jsx
│   │   └── FinancialReport.jsx
│   │
│   ├── admin/                # Admin pages
│   │   ├── AdminDashboard.jsx
│   │   ├── UserManagement.jsx
│   │   ├── BookingManagement.jsx
│   │   ├── PaymentVerification.jsx
│   │   ├── PromotionManagement.jsx
│   │   └── Reports.jsx
│   │
│   └── booking/              # Booking flow
│       ├── BookingForm.jsx
│       ├── BookingPayment.jsx
│       └── BookingSuccess.jsx
│
├── components/           # Reusable components
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Card.jsx
│   │   ├── Modal.jsx
│   │   ├── Loading.jsx
│   │   ├── Pagination.jsx
│   │   └── Badge.jsx
│   │
│   ├── apartment/
│   │   ├── ApartmentCard.jsx
│   │   ├── ApartmentFilters.jsx
│   │   ├── ImageGallery.jsx
│   │   └── FacilityList.jsx
│   │
│   ├── booking/
│   │   ├── BookingCard.jsx
│   │   ├── BookingSummary.jsx
│   │   └── PaymentMethod.jsx
│   │
│   └── dashboard/
│       ├── StatsCard.jsx
│       ├── Chart.jsx
│       └── RecentActivity.jsx
│
├── hooks/                # Custom hooks
│   ├── useAuth.js
│   ├── useApartments.js
│   ├── useBookings.js
│   └── useNotifications.js
│
└── utils/                # Utility functions
    ├── constants.js
    ├── helpers.js
    ├── formatters.js
    └── validators.js
```

## 🔐 Authentication Flow

1. User logs in via `/login`
2. JWT tokens stored in localStorage
3. Axios interceptor adds token to requests
4. Auto-refresh token when expired
5. Route guards protect authenticated pages
6. Role-based access control

## 🎯 Key Features

### Public Pages
- ✅ Landing page with featured apartments
- ✅ Browse and search apartments
- ✅ View apartment details
- ✅ Login/Register

### Tenant Features
- ✅ Personal dashboard
- ✅ Browse and favorite apartments
- ✅ Create bookings
- ✅ Manage payments
- ✅ Upload documents
- ✅ Write reviews
- ✅ Profile management

### Owner Features
- ✅ Owner dashboard
- ✅ Manage apartments/units
- ✅ View and approve bookings
- ✅ Financial reports
- ✅ Payment management

### Admin Features
- ✅ Admin dashboard with analytics
- ✅ User management (CRUD)
- ✅ Booking management
- ✅ Payment verification
- ✅ Promotion management
- ✅ Generate reports

## 🎨 Styling

Using Tailwind CSS with custom configuration:
- Primary color: `#6B1F7B` (Purple)
- Secondary color: `#1E1B4B` (Navy)
- Custom utility classes in `index.css`
- Responsive design mobile-first

### Custom Classes
```css
.btn              - Base button
.btn-primary      - Primary button
.btn-secondary    - Secondary button
.btn-outline      - Outline button
.card             - Card container
.input            - Form input
.badge            - Badge/tag
.spinner          - Loading spinner
```

## 📡 API Integration

### Base URL
```
http://localhost:5001/api
```

### Axios Instance
Auto-configured with:
- Authorization header injection
- Token refresh on 401
- Global error handling
- Toast notifications

### Example API Call
```jsx
import axios from '@/api/axios'

const fetchApartments = async () => {
  const response = await axios.get('/apartments')
  return response.data
}
```

## 🔄 State Management

### Auth Store (Zustand)
```jsx
import { useAuthStore } from '@/stores/authStore'

const { user, isAuthenticated, login, logout } = useAuthStore()
```

### React Query
```jsx
import { useQuery } from '@tanstack/react-query'

const { data, isLoading } = useQuery({
  queryKey: ['apartments'],
  queryFn: fetchApartments
})
```

## 🛣️ Routing

### Public Routes
- `/` - Home
- `/login` - Login
- `/register` - Register
- `/apartments` - Browse apartments
- `/apartments/:id` - Apartment details

### Protected Routes (Tenant)
- `/dashboard` - Tenant dashboard
- `/my-bookings` - My bookings
- `/my-payments` - My payments
- `/favorites` - Favorite apartments
- `/booking/:id` - Create booking

### Protected Routes (Owner)
- `/owner/dashboard` - Owner dashboard
- `/owner/units` - Manage units
- `/owner/bookings` - Unit bookings
- `/owner/financial` - Financial reports

### Protected Routes (Admin)
- `/admin/dashboard` - Admin dashboard
- `/admin/users` - User management
- `/admin/bookings` - Booking management
- `/admin/payments` - Payment verification
- `/admin/promotions` - Promotions
- `/admin/reports` - Reports

## 🚧 TODO - Components to Create

### Priority 1 (Core Functionality)
1. **Layouts**
   - `MainLayout.jsx` - Public pages layout
   - `DashboardLayout.jsx` - Dashboard layout with sidebar
   - `Navbar.jsx` - Navigation bar
   - `Footer.jsx` - Footer component

2. **Pages - Public**
   - `Home.jsx` - Landing page with hero & featured apartments
   - `Login.jsx` - Login form
   - `Register.jsx` - Registration form
   - `ApartmentList.jsx` - Browse apartments with filters
   - `ApartmentDetail.jsx` - Detailed apartment view

3. **Pages - Tenant**
   - `TenantDashboard.jsx` - Tenant dashboard
   - `MyBookings.jsx` - List of bookings
   - `BookingForm.jsx` - Create booking
   - `BookingPayment.jsx` - Payment page

### Priority 2 (Additional Features)
4. **Pages - Owner**
   - `OwnerDashboard.jsx` - Owner dashboard
   - `MyUnits.jsx` - Manage apartments
   - `UnitBookings.jsx` - View bookings

5. **Pages - Admin**
   - `AdminDashboard.jsx` - Admin dashboard with stats
   - `UserManagement.jsx` - Manage users
   - `BookingManagement.jsx` - Manage bookings

6. **Common Components**
   - `Button.jsx` - Reusable button
   - `Input.jsx` - Form input
   - `Card.jsx` - Card container
   - `Modal.jsx` - Modal dialog
   - `Loading.jsx` - Loading spinner
   - `Pagination.jsx` - Pagination component

### Priority 3 (Enhancement)
7. **Specialized Components**
   - `ApartmentCard.jsx` - Apartment card display
   - `ApartmentFilters.jsx` - Search filters
   - `ImageGallery.jsx` - Image gallery
   - `BookingCard.jsx` - Booking display
   - `StatsCard.jsx` - Dashboard statistics card

8. **API Services**
   - `api/apartments.js` - Apartment API calls
   - `api/bookings.js` - Booking API calls
   - `api/payments.js` - Payment API calls
   - `api/admin.js` - Admin API calls

9. **Utilities**
   - `utils/formatters.js` - Format currency, dates
   - `utils/validators.js` - Form validations
   - `utils/helpers.js` - Helper functions
   - `utils/constants.js` - App constants

## 🎯 Development Guide

### Creating a New Page
1. Create component in `src/pages/`
2. Add route in `App.jsx`
3. Add to navigation if needed
4. Connect to API if needed

### Creating a New Component
1. Create in appropriate `src/components/` subdirectory
2. Export as default
3. Use Tailwind for styling
4. Make reusable with props

### Making API Calls
```jsx
import axios from '@/api/axios'
import { useQuery, useMutation } from '@tanstack/react-query'

// Query (GET)
const { data, isLoading } = useQuery({
  queryKey: ['apartments'],
  queryFn: () => axios.get('/apartments').then(res => res.data)
})

// Mutation (POST/PUT/DELETE)
const mutation = useMutation({
  mutationFn: (data) => axios.post('/apartments', data),
  onSuccess: () => {
    toast.success('Success!')
  }
})
```

### Form Handling
```jsx
import { useForm } from 'react-hook-form'

const { register, handleSubmit, formState: { errors } } = useForm()

const onSubmit = (data) => {
  // Handle form submission
}

<form onSubmit={handleSubmit(onSubmit)}>
  <input {...register('email', { required: true })} />
  {errors.email && <span>This field is required</span>}
</form>
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
# Or use different port
npm run dev -- --port 3001
```

### Cannot Connect to Backend
- Ensure backend is running on port 5001
- Check VITE_API_URL in .env
- Verify CORS is enabled in backend

### Token Expired
- Tokens auto-refresh via axios interceptor
- If refresh fails, user is logged out automatically

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [React Query](https://tanstack.com/query)
- [Zustand](https://github.com/pmndrs/zustand)

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## 📝 License

Educational project for Proyek Perangkat Lunak course.