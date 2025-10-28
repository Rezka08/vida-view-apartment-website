import os
import uuid
from datetime import datetime, timedelta
from werkzeug.utils import secure_filename
from flask import current_app
from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from models import User, db
import random
import string

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

def save_file(file, folder='general'):
    """Save uploaded file and return filename"""
    if file and allowed_file(file.filename):
        # Generate unique filename
        ext = file.filename.rsplit('.', 1)[1].lower()
        filename = f"{uuid.uuid4().hex}.{ext}"
        
        # Create upload directory if it doesn't exist
        upload_dir = os.path.join(current_app.config['UPLOAD_FOLDER'], folder)
        os.makedirs(upload_dir, exist_ok=True)
        
        # Save file
        filepath = os.path.join(upload_dir, filename)
        file.save(filepath)
        
        # Return relative path
        return f"/uploads/{folder}/{filename}"
    return None

def generate_booking_code():
    """Generate unique booking code"""
    date_str = datetime.now().strftime('%Y%m%d')
    random_str = ''.join(random.choices(string.digits, k=6))
    return f"BK{date_str}{random_str}"

def generate_payment_code():
    """Generate unique payment code"""
    date_str = datetime.now().strftime('%Y%m%d')
    random_str = ''.join(random.choices(string.digits, k=6))
    return f"PAY{date_str}{random_str}"

def calculate_total_amount(monthly_rent, total_months, deposit, utility_deposit=0, admin_fee=0):
    """Calculate total booking amount"""
    total = (monthly_rent * total_months) + deposit + utility_deposit + admin_fee
    return total

def role_required(*allowed_roles):
    """Decorator to check if user has required role"""
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            
            if not user:
                return {'message': 'User not found'}, 404
            
            if user.role not in allowed_roles:
                return {'message': 'Access denied. Insufficient permissions.'}, 403
            
            return fn(*args, **kwargs)
        return wrapper
    return decorator

def paginate_query(query, page=1, per_page=10):
    """Paginate SQLAlchemy query"""
    paginated = query.paginate(page=page, per_page=per_page, error_out=False)
    return {
        'items': paginated.items,
        'total': paginated.total,
        'page': paginated.page,
        'per_page': paginated.per_page,
        'pages': paginated.pages,
        'has_next': paginated.has_next,
        'has_prev': paginated.has_prev
    }

def create_notification(user_id, title, message, notification_type='system', related_id=None):
    """Create notification for user"""
    from models import Notification
    
    notification = Notification(
        user_id=user_id,
        title=title,
        message=message,
        type=notification_type,
        related_id=related_id
    )
    db.session.add(notification)
    db.session.commit()
    return notification

def log_activity(user_id, action, entity_type, entity_id=None, old_data=None, new_data=None, ip_address=None, user_agent=None):
    """Log user activity"""
    from models import ActivityLog
    
    log = ActivityLog(
        user_id=user_id,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        old_data=old_data,
        new_data=new_data,
        ip_address=ip_address,
        user_agent=user_agent
    )
    db.session.add(log)
    db.session.commit()
    return log

def format_currency(amount):
    """Format number as Indonesian Rupiah"""
    return f"Rp {amount:,.0f}".replace(',', '.')

def calculate_months_between(start_date, end_date):
    """Calculate number of months between two dates"""
    return (end_date.year - start_date.year) * 12 + (end_date.month - start_date.month)

def get_current_user():
    """Get current authenticated user"""
    verify_jwt_in_request()
    current_user_id = get_jwt_identity()
    return User.query.get(current_user_id)

def send_email_notification(to_email, subject, body):
    """Send email notification (stub - implement with actual email service)"""
    # TODO: Implement actual email sending
    print(f"Sending email to {to_email}")
    print(f"Subject: {subject}")
    print(f"Body: {body}")
    return True

def validate_dates(start_date, end_date):
    """Validate booking dates"""
    errors = []
    
    if start_date >= end_date:
        errors.append("End date must be after start date")
    
    if start_date < datetime.now().date():
        errors.append("Start date cannot be in the past")
    
    return errors

def check_apartment_availability(apartment_id, start_date, end_date):
    """Check if apartment is available for given date range"""
    from models import Booking
    
    conflicting_bookings = Booking.query.filter(
        Booking.apartment_id == apartment_id,
        Booking.status.in_(['confirmed', 'active']),
        db.or_(
            db.and_(Booking.start_date <= start_date, Booking.end_date >= start_date),
            db.and_(Booking.start_date <= end_date, Booking.end_date >= end_date),
            db.and_(Booking.start_date >= start_date, Booking.end_date <= end_date)
        )
    ).first()
    
    return conflicting_bookings is None