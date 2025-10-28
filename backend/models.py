from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import json

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    role = db.Column(db.Enum('tenant', 'owner', 'admin'), nullable=False)
    profile_photo = db.Column(db.String(255))
    id_card_number = db.Column(db.String(50))
    id_card_photo = db.Column(db.String(255))
    address = db.Column(db.Text)
    birth_date = db.Column(db.Date)
    status = db.Column(db.Enum('active', 'inactive', 'suspended'), default='active')
    email_verified_at = db.Column(db.DateTime)
    document_verified_at = db.Column(db.DateTime)
    last_login = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    owned_apartments = db.relationship('Apartment', backref='owner', lazy=True, foreign_keys='Apartment.owner_id')
    bookings = db.relationship('Booking', backref='tenant', lazy=True, foreign_keys='Booking.tenant_id')
    reviews = db.relationship('Review', backref='reviewer', lazy=True, foreign_keys='Review.tenant_id')
    favorites = db.relationship('Favorite', backref='user', lazy=True, cascade='all, delete-orphan')
    notifications = db.relationship('Notification', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        self.password = generate_password_hash(password, method='pbkdf2:sha256')
    
    def check_password(self, password):
        return check_password_hash(self.password, password)
    
    def to_dict(self, include_sensitive=False):
        data = {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'full_name': self.full_name,
            'phone': self.phone,
            'role': self.role,
            'profile_photo': self.profile_photo,
            'address': self.address,
            'birth_date': self.birth_date.isoformat() if self.birth_date else None,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        if include_sensitive:
            data.update({
                'id_card_number': self.id_card_number,
                'id_card_photo': self.id_card_photo,
                'email_verified_at': self.email_verified_at.isoformat() if self.email_verified_at else None,
                'document_verified_at': self.document_verified_at.isoformat() if self.document_verified_at else None
            })
        return data

class Apartment(db.Model):
    __tablename__ = 'apartments'
    
    id = db.Column(db.Integer, primary_key=True)
    unit_number = db.Column(db.String(20), nullable=False)
    unit_type = db.Column(db.String(50), nullable=False)
    floor = db.Column(db.Integer)
    size_sqm = db.Column(db.Numeric(8, 2))
    bedrooms = db.Column(db.Integer)
    bathrooms = db.Column(db.Integer)
    price_per_month = db.Column(db.Numeric(12, 2), nullable=False)
    deposit_amount = db.Column(db.Numeric(12, 2))
    seasonal_pricing = db.Column(db.JSON)
    minimum_stay_months = db.Column(db.Integer, default=1)
    description = db.Column(db.Text)
    furnished = db.Column(db.Boolean, default=False)
    view_direction = db.Column(db.String(50))
    electricity_watt = db.Column(db.Integer)
    water_source = db.Column(db.String(50))
    parking_slots = db.Column(db.Integer)
    pet_friendly = db.Column(db.Boolean, default=False)
    smoking_allowed = db.Column(db.Boolean, default=False)
    availability_status = db.Column(db.Enum('available', 'occupied'), default='available')
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    total_views = db.Column(db.Integer, default=0)
    total_inquiries = db.Column(db.Integer, default=0)
    avg_rating = db.Column(db.Numeric(3, 2), default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    photos = db.relationship('UnitPhoto', backref='apartment', lazy=True, cascade='all, delete-orphan')
    facilities = db.relationship('ApartmentFacility', backref='apartment', lazy=True, cascade='all, delete-orphan')
    bookings = db.relationship('Booking', backref='apartment', lazy=True)
    reviews = db.relationship('Review', backref='apartment', lazy=True)
    favorites = db.relationship('Favorite', backref='apartment', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self, include_relations=False):
        data = {
            'id': self.id,
            'unit_number': self.unit_number,
            'unit_type': self.unit_type,
            'floor': self.floor,
            'size_sqm': float(self.size_sqm) if self.size_sqm else None,
            'bedrooms': self.bedrooms,
            'bathrooms': self.bathrooms,
            'price_per_month': float(self.price_per_month),
            'deposit_amount': float(self.deposit_amount) if self.deposit_amount else None,
            'minimum_stay_months': self.minimum_stay_months,
            'description': self.description,
            'furnished': self.furnished,
            'view_direction': self.view_direction,
            'electricity_watt': self.electricity_watt,
            'parking_slots': self.parking_slots,
            'pet_friendly': self.pet_friendly,
            'smoking_allowed': self.smoking_allowed,
            'availability_status': self.availability_status,
            'owner_id': self.owner_id,
            'total_views': self.total_views,
            'avg_rating': float(self.avg_rating) if self.avg_rating else 0,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        
        if include_relations:
            data['photos'] = [photo.to_dict() for photo in self.photos]
            data['facilities'] = [fac.facility.to_dict() for fac in self.facilities]
            data['owner'] = self.owner.to_dict() if self.owner else None
        
        return data

class Booking(db.Model):
    __tablename__ = 'bookings'
    
    id = db.Column(db.Integer, primary_key=True)
    apartment_id = db.Column(db.Integer, db.ForeignKey('apartments.id'), nullable=False)
    tenant_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    booking_code = db.Column(db.String(50), unique=True, nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    total_months = db.Column(db.Integer)
    monthly_rent = db.Column(db.Numeric(12, 2))
    deposit_paid = db.Column(db.Numeric(12, 2))
    utility_deposit = db.Column(db.Numeric(12, 2))
    admin_fee = db.Column(db.Numeric(12, 2))
    total_amount = db.Column(db.Numeric(12, 2))
    status = db.Column(db.Enum('pending', 'confirmed', 'active', 'completed', 'cancelled', 'rejected'), default='pending')
    rejection_reason = db.Column(db.Text)
    contract_file = db.Column(db.String(255))
    contract_start_date = db.Column(db.Date)
    contract_end_date = db.Column(db.Date)
    auto_renewal = db.Column(db.Boolean, default=False)
    notes = db.Column(db.Text)
    approved_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    approved_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    payments = db.relationship('Payment', backref='booking', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self, include_relations=False):
        data = {
            'id': self.id,
            'apartment_id': self.apartment_id,
            'tenant_id': self.tenant_id,
            'booking_code': self.booking_code,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'total_months': self.total_months,
            'monthly_rent': float(self.monthly_rent) if self.monthly_rent else None,
            'deposit_paid': float(self.deposit_paid) if self.deposit_paid else None,
            'utility_deposit': float(self.utility_deposit) if self.utility_deposit else None,
            'admin_fee': float(self.admin_fee) if self.admin_fee else None,
            'total_amount': float(self.total_amount) if self.total_amount else None,
            'status': self.status,
            'rejection_reason': self.rejection_reason,
            'contract_file': self.contract_file,
            'notes': self.notes,
            'approved_at': self.approved_at.isoformat() if self.approved_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        
        if include_relations:
            data['apartment'] = self.apartment.to_dict() if self.apartment else None
            data['tenant'] = self.tenant.to_dict() if self.tenant else None
            data['payments'] = [payment.to_dict() for payment in self.payments]
        
        return data

class Payment(db.Model):
    __tablename__ = 'payments'
    
    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('bookings.id'), nullable=False)
    payment_code = db.Column(db.String(50), unique=True, nullable=False)
    payment_type = db.Column(db.Enum('deposit', 'monthly_rent', 'penalty', 'refund', 'utility'))
    amount = db.Column(db.Numeric(12, 2), nullable=False)
    payment_method = db.Column(db.Enum('bank_transfer', 'credit_card', 'e_wallet', 'cash'))
    payment_status = db.Column(db.Enum('pending', 'completed', 'failed', 'refunded'), default='pending')
    payment_date = db.Column(db.DateTime)
    due_date = db.Column(db.Date)
    transaction_id = db.Column(db.String(100))
    payment_gateway_ref = db.Column(db.String(255))
    payment_gateway_response = db.Column(db.JSON)
    receipt_file = db.Column(db.String(255))
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'booking_id': self.booking_id,
            'payment_code': self.payment_code,
            'payment_type': self.payment_type,
            'amount': float(self.amount),
            'payment_method': self.payment_method,
            'payment_status': self.payment_status,
            'payment_date': self.payment_date.isoformat() if self.payment_date else None,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'transaction_id': self.transaction_id,
            'receipt_file': self.receipt_file,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class UnitPhoto(db.Model):
    __tablename__ = 'unit_photos'
    
    id = db.Column(db.Integer, primary_key=True)
    apartment_id = db.Column(db.Integer, db.ForeignKey('apartments.id'), nullable=False)
    photo_url = db.Column(db.String(255), nullable=False)
    photo_type = db.Column(db.Enum('main', 'bedroom', 'bathroom', 'kitchen', 'living_room', 'balcony', 'other'), default='other')
    caption = db.Column(db.String(255))
    display_order = db.Column(db.Integer, default=0)
    is_cover = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'apartment_id': self.apartment_id,
            'photo_url': self.photo_url,
            'photo_type': self.photo_type,
            'caption': self.caption,
            'display_order': self.display_order,
            'is_cover': self.is_cover
        }

class Facility(db.Model):
    __tablename__ = 'facilities'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    icon = db.Column(db.String(100))
    category = db.Column(db.Enum('building', 'unit', 'area'), default='building')
    status = db.Column(db.Enum('active', 'inactive'), default='active')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'icon': self.icon,
            'category': self.category,
            'status': self.status
        }

class ApartmentFacility(db.Model):
    __tablename__ = 'apartment_facilities'
    
    id = db.Column(db.Integer, primary_key=True)
    apartment_id = db.Column(db.Integer, db.ForeignKey('apartments.id'), nullable=False)
    facility_id = db.Column(db.Integer, db.ForeignKey('facilities.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    facility = db.relationship('Facility', backref='apartment_facilities')

class Review(db.Model):
    __tablename__ = 'reviews'
    
    id = db.Column(db.Integer, primary_key=True)
    apartment_id = db.Column(db.Integer, db.ForeignKey('apartments.id'), nullable=False)
    tenant_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    booking_id = db.Column(db.Integer, db.ForeignKey('bookings.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    review_text = db.Column(db.Text)
    photos = db.Column(db.JSON)
    is_approved = db.Column(db.Boolean, default=False)
    approved_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    approved_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'apartment_id': self.apartment_id,
            'tenant_id': self.tenant_id,
            'booking_id': self.booking_id,
            'rating': self.rating,
            'review_text': self.review_text,
            'photos': self.photos,
            'is_approved': self.is_approved,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'tenant': self.reviewer.to_dict() if self.reviewer else None
        }

class Favorite(db.Model):
    __tablename__ = 'favorites'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    apartment_id = db.Column(db.Integer, db.ForeignKey('apartments.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'apartment_id': self.apartment_id,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Notification(db.Model):
    __tablename__ = 'notifications'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)
    type = db.Column(db.Enum('booking', 'payment', 'system', 'promotion'), default='system')
    related_id = db.Column(db.Integer)
    is_read = db.Column(db.Boolean, default=False)
    send_email = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'message': self.message,
            'type': self.type,
            'related_id': self.related_id,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Promotion(db.Model):
    __tablename__ = 'promotions'
    
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(50), unique=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    type = db.Column(db.Enum('percent', 'fixed_amount', 'seasonal', 'coupon', 'special_rate'), default='percent')
    value = db.Column(db.Numeric(12, 4))
    apartment_id = db.Column(db.Integer, db.ForeignKey('apartments.id'))
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    min_nights = db.Column(db.Integer)
    active = db.Column(db.Boolean, default=True)
    usage_limit = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'code': self.code,
            'title': self.title,
            'description': self.description,
            'type': self.type,
            'value': float(self.value) if self.value else None,
            'apartment_id': self.apartment_id,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'min_nights': self.min_nights,
            'active': self.active,
            'usage_limit': self.usage_limit
        }

class ActivityLog(db.Model):
    __tablename__ = 'activity_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    action = db.Column(db.String(50), nullable=False)
    entity_type = db.Column(db.String(50), nullable=False)
    entity_id = db.Column(db.Integer)
    old_data = db.Column(db.JSON)
    new_data = db.Column(db.JSON)
    ip_address = db.Column(db.String(45))
    user_agent = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)