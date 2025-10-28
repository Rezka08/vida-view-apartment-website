from flask import Blueprint, request, jsonify
from models import db, User, Apartment, Booking, Payment, Review
from flask_jwt_extended import jwt_required, get_jwt_identity
from utils import role_required
from sqlalchemy import func, and_, extract
from datetime import datetime, timedelta

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

@admin_bp.route('/dashboard', methods=['GET'])
@jwt_required()
@role_required('admin')
def get_dashboard_stats():
    """Get admin dashboard statistics"""
    try:
        # Total counts
        total_users = User.query.count()
        total_tenants = User.query.filter_by(role='tenant').count()
        total_owners = User.query.filter_by(role='owner').count()
        
        total_apartments = Apartment.query.count()
        available_apartments = Apartment.query.filter_by(availability_status='available').count()
        occupied_apartments = Apartment.query.filter_by(availability_status='occupied').count()
        
        total_bookings = Booking.query.count()
        pending_bookings = Booking.query.filter_by(status='pending').count()
        active_bookings = Booking.query.filter_by(status='active').count()
        
        # Revenue calculations
        current_month = datetime.now().month
        current_year = datetime.now().year
        
        monthly_revenue = db.session.query(func.sum(Payment.amount)).filter(
            and_(
                Payment.payment_status == 'completed',
                extract('month', Payment.payment_date) == current_month,
                extract('year', Payment.payment_date) == current_year
            )
        ).scalar() or 0
        
        yearly_revenue = db.session.query(func.sum(Payment.amount)).filter(
            and_(
                Payment.payment_status == 'completed',
                extract('year', Payment.payment_date) == current_year
            )
        ).scalar() or 0
        
        pending_payments = db.session.query(func.sum(Payment.amount)).filter(
            Payment.payment_status == 'pending'
        ).scalar() or 0
        
        # Recent activities
        recent_bookings = Booking.query.order_by(Booking.created_at.desc()).limit(5).all()
        recent_payments = Payment.query.order_by(Payment.created_at.desc()).limit(5).all()
        recent_users = User.query.order_by(User.created_at.desc()).limit(5).all()
        
        # Occupancy rate
        occupancy_rate = (occupied_apartments / total_apartments * 100) if total_apartments > 0 else 0
        
        return jsonify({
            'stats': {
                'users': {
                    'total': total_users,
                    'tenants': total_tenants,
                    'owners': total_owners
                },
                'apartments': {
                    'total': total_apartments,
                    'available': available_apartments,
                    'occupied': occupied_apartments
                },
                'bookings': {
                    'total': total_bookings,
                    'pending': pending_bookings,
                    'active': active_bookings
                },
                'revenue': {
                    'monthly': float(monthly_revenue),
                    'yearly': float(yearly_revenue),
                    'pending': float(pending_payments)
                },
                'occupancy_rate': round(occupancy_rate, 2)
            },
            'recent': {
                'bookings': [booking.to_dict(include_relations=True) for booking in recent_bookings],
                'payments': [payment.to_dict() for payment in recent_payments],
                'users': [user.to_dict() for user in recent_users]
            }
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@admin_bp.route('/owner-dashboard', methods=['GET'])
@jwt_required()
@role_required('owner')
def get_owner_dashboard():
    """Get owner dashboard statistics"""
    try:
        current_user_id = get_jwt_identity()
        
        # Owner's apartments
        owner_apartments = Apartment.query.filter_by(owner_id=current_user_id).all()
        apartment_ids = [apt.id for apt in owner_apartments]
        
        total_apartments = len(owner_apartments)
        available_apartments = len([apt for apt in owner_apartments if apt.availability_status == 'available'])
        occupied_apartments = len([apt for apt in owner_apartments if apt.availability_status == 'occupied'])
        
        # Bookings for owner's apartments
        total_bookings = Booking.query.filter(Booking.apartment_id.in_(apartment_ids)).count()
        pending_bookings = Booking.query.filter(
            and_(
                Booking.apartment_id.in_(apartment_ids),
                Booking.status == 'pending'
            )
        ).count()
        active_bookings = Booking.query.filter(
            and_(
                Booking.apartment_id.in_(apartment_ids),
                Booking.status == 'active'
            )
        ).count()
        
        # Revenue from owner's apartments
        current_month = datetime.now().month
        current_year = datetime.now().year
        
        monthly_revenue = db.session.query(func.sum(Payment.amount)).join(Booking).filter(
            and_(
                Booking.apartment_id.in_(apartment_ids),
                Payment.payment_status == 'completed',
                extract('month', Payment.payment_date) == current_month,
                extract('year', Payment.payment_date) == current_year
            )
        ).scalar() or 0
        
        yearly_revenue = db.session.query(func.sum(Payment.amount)).join(Booking).filter(
            and_(
                Booking.apartment_id.in_(apartment_ids),
                Payment.payment_status == 'completed',
                extract('year', Payment.payment_date) == current_year
            )
        ).scalar() or 0
        
        # Recent bookings
        recent_bookings = Booking.query.filter(
            Booking.apartment_id.in_(apartment_ids)
        ).order_by(Booking.created_at.desc()).limit(5).all()
        
        occupancy_rate = (occupied_apartments / total_apartments * 100) if total_apartments > 0 else 0
        
        return jsonify({
            'stats': {
                'apartments': {
                    'total': total_apartments,
                    'available': available_apartments,
                    'occupied': occupied_apartments
                },
                'bookings': {
                    'total': total_bookings,
                    'pending': pending_bookings,
                    'active': active_bookings
                },
                'revenue': {
                    'monthly': float(monthly_revenue),
                    'yearly': float(yearly_revenue)
                },
                'occupancy_rate': round(occupancy_rate, 2)
            },
            'recent_bookings': [booking.to_dict(include_relations=True) for booking in recent_bookings],
            'apartments': [apt.to_dict(include_relations=True) for apt in owner_apartments]
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@admin_bp.route('/reports/occupancy', methods=['GET'])
@jwt_required()
@role_required('admin', 'owner')
def get_occupancy_report():
    """Get occupancy report"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        # Filter by owner if role is owner
        if user.role == 'owner':
            apartments = Apartment.query.filter_by(owner_id=current_user_id).all()
        else:
            apartments = Apartment.query.all()
        
        total = len(apartments)
        occupied = len([apt for apt in apartments if apt.availability_status == 'occupied'])
        available = len([apt for apt in apartments if apt.availability_status == 'available'])
        
        occupancy_rate = (occupied / total * 100) if total > 0 else 0
        
        # By unit type
        by_type = {}
        for apt in apartments:
            if apt.unit_type not in by_type:
                by_type[apt.unit_type] = {'total': 0, 'occupied': 0, 'available': 0}
            
            by_type[apt.unit_type]['total'] += 1
            if apt.availability_status == 'occupied':
                by_type[apt.unit_type]['occupied'] += 1
            else:
                by_type[apt.unit_type]['available'] += 1
        
        return jsonify({
            'summary': {
                'total': total,
                'occupied': occupied,
                'available': available,
                'occupancy_rate': round(occupancy_rate, 2)
            },
            'by_type': by_type
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@admin_bp.route('/reports/revenue', methods=['GET'])
@jwt_required()
@role_required('admin', 'owner')
def get_revenue_report():
    """Get revenue report"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        year = request.args.get('year', datetime.now().year, type=int)
        
        # Base query
        query = db.session.query(
            extract('month', Payment.payment_date).label('month'),
            func.sum(Payment.amount).label('total')
        ).filter(
            and_(
                Payment.payment_status == 'completed',
                extract('year', Payment.payment_date) == year
            )
        )
        
        # Filter by owner if role is owner
        if user.role == 'owner':
            query = query.join(Booking).join(Apartment).filter(
                Apartment.owner_id == current_user_id
            )
        
        query = query.group_by(extract('month', Payment.payment_date))
        
        results = query.all()
        
        # Format results
        monthly_data = {i: 0 for i in range(1, 13)}
        for month, total in results:
            monthly_data[int(month)] = float(total)
        
        total_revenue = sum(monthly_data.values())
        
        return jsonify({
            'year': year,
            'total_revenue': total_revenue,
            'monthly_data': monthly_data
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@admin_bp.route('/reports/top-apartments', methods=['GET'])
@jwt_required()
@role_required('admin')
def get_top_apartments():
    """Get top performing apartments"""
    try:
        limit = request.args.get('limit', 10, type=int)
        
        # Most viewed
        most_viewed = Apartment.query.order_by(Apartment.total_views.desc()).limit(limit).all()
        
        # Highest rated
        highest_rated = Apartment.query.filter(
            Apartment.avg_rating > 0
        ).order_by(Apartment.avg_rating.desc()).limit(limit).all()
        
        # Most bookings
        most_booked = db.session.query(
            Apartment,
            func.count(Booking.id).label('booking_count')
        ).join(Booking).group_by(Apartment.id).order_by(
            func.count(Booking.id).desc()
        ).limit(limit).all()
        
        return jsonify({
            'most_viewed': [apt.to_dict() for apt in most_viewed],
            'highest_rated': [apt.to_dict() for apt in highest_rated],
            'most_booked': [
                {**apt.to_dict(), 'booking_count': count}
                for apt, count in most_booked
            ]
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500