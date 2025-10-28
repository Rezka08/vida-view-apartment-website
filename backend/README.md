# Vida View Backend - Flask REST API

Backend API untuk sistem penyewaan apartemen Vida View.

## Technology Stack

- **Framework**: Flask 3.0
- **Database**: MySQL dengan PyMySQL
- **Authentication**: JWT (Flask-JWT-Extended)
- **ORM**: SQLAlchemy
- **CORS**: Flask-CORS

## Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Edit `.env` file with your database credentials and secret keys.

### 3. Initialize Database

```bash
# Create database in MySQL
mysql -u root -p
CREATE DATABASE vidaview_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# Run the SQL schema
mysql -u root -p vidaview_db < ../vidaview_schema.sql

# Optional: Load sample data
mysql -u root -p vidaview_db < ../sample_data.sql
```

### 4. Run the Application

```bash
python app.py
```

The API will be available at `http://localhost:5001`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout

### Apartments
- `GET /api/apartments` - Get all apartments (with filters)
- `GET /api/apartments/<id>` - Get apartment details
- `POST /api/apartments` - Create apartment (Owner/Admin)
- `PUT /api/apartments/<id>` - Update apartment (Owner/Admin)
- `DELETE /api/apartments/<id>` - Delete apartment (Owner/Admin)
- `POST /api/apartments/<id>/photos` - Upload apartment photo
- `POST /api/apartments/<id>/favorite` - Toggle favorite
- `GET /api/apartments/favorites` - Get user favorites

### Bookings
- `GET /api/bookings` - Get bookings
- `GET /api/bookings/<id>` - Get booking details
- `POST /api/bookings` - Create booking
- `POST /api/bookings/<id>/approve` - Approve booking (Owner/Admin)
- `POST /api/bookings/<id>/reject` - Reject booking (Owner/Admin)
- `POST /api/bookings/<id>/cancel` - Cancel booking
- `PUT /api/bookings/<id>` - Update booking (Admin)

### Payments
- `GET /api/payments` - Get payments
- `GET /api/payments/<id>` - Get payment details
- `POST /api/payments` - Create payment (Admin)
- `POST /api/payments/<id>/confirm` - Confirm payment
- `POST /api/payments/<id>/verify` - Verify payment (Owner/Admin)
- `GET /api/payments/booking/<booking_id>` - Get booking payments

### Users
- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/profile/photo` - Upload profile photo
- `POST /api/users/profile/documents` - Upload documents
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/<id>` - Get user (Admin)
- `PUT /api/users/<id>` - Update user (Admin)
- `DELETE /api/users/<id>` - Delete user (Admin)
- `POST /api/users/<id>/verify-documents` - Verify documents (Admin)

### Reviews
- `POST /api/reviews` - Create review
- `POST /api/reviews/<id>/approve` - Approve review (Admin)
- `GET /api/reviews/apartment/<id>` - Get apartment reviews

### Facilities
- `GET /api/facilities` - Get facilities
- `POST /api/facilities` - Create facility (Admin)
- `PUT /api/facilities/<id>` - Update facility (Admin)
- `DELETE /api/facilities/<id>` - Delete facility (Admin)

### Notifications
- `GET /api/notifications` - Get notifications
- `POST /api/notifications/<id>/read` - Mark as read
- `POST /api/notifications/mark-all-read` - Mark all as read
- `GET /api/notifications/unread-count` - Get unread count
- `DELETE /api/notifications/<id>` - Delete notification

### Admin
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/owner-dashboard` - Owner dashboard stats
- `GET /api/admin/reports/occupancy` - Occupancy report
- `GET /api/admin/reports/revenue` - Revenue report
- `GET /api/admin/reports/top-apartments` - Top apartments

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Role-Based Access Control

- **Tenant**: Can browse apartments, create bookings, make payments, write reviews
- **Owner**: Can manage their apartments, view bookings, manage payments
- **Admin**: Full access to all resources

## Error Handling

API returns standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Development

```bash
# Run in development mode
FLASK_ENV=development python app.py
```

## Testing

```bash
# Run tests (if implemented)
pytest
```

## Project Structure

```
backend/
├── app.py              # Main application file
├── config.py           # Configuration
├── models.py           # Database models
├── utils.py            # Helper functions
├── requirements.txt    # Python dependencies
├── .env.example        # Environment variables template
├── routes/
│   ├── __init__.py
│   ├── auth.py         # Authentication routes
│   ├── apartments.py   # Apartment routes
│   ├── bookings.py     # Booking routes
│   ├── payments.py     # Payment routes
│   ├── users.py        # User routes
│   ├── reviews.py      # Review routes
│   ├── facilities.py   # Facility routes
│   ├── notifications.py # Notification routes
│   └── admin.py        # Admin routes
└── uploads/            # Uploaded files directory
```

## License

This project is developed for educational purposes.