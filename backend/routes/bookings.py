from flask import Blueprint, request, jsonify
from models import db, Booking, Apartment, Payment, User
from flask_jwt_extended import jwt_required, get_jwt_identity
from utils import (role_required, generate_booking_code, generate_payment_code,
                   calculate_total_amount, create_notification, log_activity,
                   validate_dates, check_apartment_availability, calculate_months_between)
from datetime import datetime, timedelta
from decimal import Decimal

bookings_bp = Blueprint('bookings', __name__, url_prefix='/api/bookings')

@bookings_bp.route('', methods=['GET'])
@jwt_required()
def get_bookings():
    """Get bookings based on user role"""
    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status')
        
        # Build query based on role
        if user.role == 'tenant':
            query = Booking.query.filter_by(tenant_id=current_user_id)
        elif user.role == 'owner':
            # Get bookings for owner's apartments
            query = Booking.query.join(Apartment).filter(Apartment.owner_id == current_user_id)
        else:  # admin
            query = Booking.query
        
        # Apply filters
        if status:
            query = query.filter(Booking.status == status)
        
        # Order by created_at desc
        query = query.order_by(Booking.created_at.desc())
        
        # Paginate
        bookings = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'bookings': [booking.to_dict(include_relations=True) for booking in bookings.items],
            'pagination': {
                'page': bookings.page,
                'per_page': bookings.per_page,
                'total': bookings.total,
                'pages': bookings.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@bookings_bp.route('/<int:booking_id>', methods=['GET'])
@jwt_required()
def get_booking(booking_id):
    """Get single booking details"""
    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)
        
        booking = Booking.query.get(booking_id)

        if not booking:
            return jsonify({'message': 'Booking not found'}), 404

        # Check access permission
        # Admin can access all bookings
        if user.role == 'admin':
            pass  # Admin has full access
        # Tenant can only access their own bookings
        elif user.role == 'tenant':
            if booking.tenant_id != current_user_id:
                return jsonify({'message': 'Access denied'}), 403
        # Owner can only access bookings for their apartments
        elif user.role == 'owner':
            if booking.apartment.owner_id != current_user_id:
                return jsonify({'message': 'Access denied'}), 403

        return jsonify(booking.to_dict(include_relations=True)), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@bookings_bp.route('', methods=['POST'])
@jwt_required()
@role_required('tenant', 'admin')
def create_booking():
    """Create new booking"""
    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['apartment_id', 'start_date', 'end_date']
        for field in required_fields:
            if field not in data:
                return jsonify({'message': f'{field} is required'}), 400
        
        # Get apartment
        apartment = Apartment.query.get(data['apartment_id'])
        if not apartment:
            return jsonify({'message': 'Apartment not found'}), 404
        
        if apartment.availability_status != 'available':
            return jsonify({'message': 'Apartment is not available'}), 400
        
        # Parse dates
        start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
        end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date()
        
        # Validate dates
        date_errors = validate_dates(start_date, end_date)
        if date_errors:
            return jsonify({'message': ', '.join(date_errors)}), 400
        
        # Check availability
        if not check_apartment_availability(apartment.id, start_date, end_date):
            return jsonify({'message': 'Apartment is already booked for selected dates'}), 400
        
        # Calculate months and amounts
        total_months = calculate_months_between(start_date, end_date)
        
        if total_months < apartment.minimum_stay_months:
            return jsonify({
                'message': f'Minimum stay is {apartment.minimum_stay_months} months'
            }), 400
        
        monthly_rent = apartment.price_per_month
        deposit = apartment.deposit_amount or monthly_rent
        utility_deposit = data.get('utility_deposit', monthly_rent * Decimal('0.2'))  # 20% of monthly rent
        admin_fee = data.get('admin_fee', Decimal('500000'))  # Default admin fee
        
        total_amount = calculate_total_amount(
            monthly_rent, total_months, deposit, utility_deposit, admin_fee
        )
        
        # Create booking
        booking = Booking(
            apartment_id=apartment.id,
            tenant_id=current_user_id if user.role == 'tenant' else data.get('tenant_id'),
            booking_code=generate_booking_code(),
            start_date=start_date,
            end_date=end_date,
            total_months=total_months,
            monthly_rent=monthly_rent,
            deposit_paid=deposit,
            utility_deposit=utility_deposit,
            admin_fee=admin_fee,
            total_amount=total_amount,
            status='pending',
            notes=data.get('notes')
        )
        
        db.session.add(booking)
        db.session.flush()
        
        # Create initial payment record (deposit)
        payment = Payment(
            booking_id=booking.id,
            payment_code=generate_payment_code(),
            payment_type='deposit',
            amount=deposit,
            payment_status='pending',
            due_date=datetime.now().date() + timedelta(days=3)
        )
        
        db.session.add(payment)
        db.session.commit()
        
        # Create notification for tenant
        create_notification(
            user_id=booking.tenant_id,
            title='Booking Berhasil Dibuat',
            message=f'Booking untuk {apartment.unit_number} telah dibuat. Kode booking: {booking.booking_code}',
            notification_type='booking',
            related_id=booking.id
        )
        
        # Create notification for owner
        create_notification(
            user_id=apartment.owner_id,
            title='Booking Baru',
            message=f'Ada booking baru untuk unit {apartment.unit_number}',
            notification_type='booking',
            related_id=booking.id
        )
        
        # Log activity
        log_activity(
            user_id=current_user_id,
            action='create',
            entity_type='booking',
            entity_id=booking.id,
            new_data=booking.to_dict()
        )
        
        return jsonify({
            'message': 'Booking created successfully',
            'booking': booking.to_dict(include_relations=True)
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@bookings_bp.route('/<int:booking_id>/approve', methods=['POST'])
@jwt_required()
@role_required('owner', 'admin')
def approve_booking(booking_id):
    """Approve booking (Owner/Admin only)"""
    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)
        
        booking = Booking.query.get(booking_id)
        
        if not booking:
            return jsonify({'message': 'Booking not found'}), 404
        
        # Check permission
        if user.role == 'owner' and booking.apartment.owner_id != current_user_id:
            return jsonify({'message': 'You can only approve bookings for your apartments'}), 403
        
        if booking.status != 'pending':
            return jsonify({'message': f'Booking is already {booking.status}'}), 400
        
        # Update booking status
        booking.status = 'confirmed'
        booking.approved_by = current_user_id
        booking.approved_at = datetime.utcnow()
        
        db.session.commit()
        
        # Create notification for tenant
        create_notification(
            user_id=booking.tenant_id,
            title='Booking Disetujui',
            message=f'Booking Anda untuk {booking.apartment.unit_number} telah disetujui!',
            notification_type='booking',
            related_id=booking.id
        )
        
        # Log activity
        log_activity(
            user_id=current_user_id,
            action='approve',
            entity_type='booking',
            entity_id=booking_id
        )
        
        return jsonify({
            'message': 'Booking approved successfully',
            'booking': booking.to_dict(include_relations=True)
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@bookings_bp.route('/<int:booking_id>/reject', methods=['POST'])
@jwt_required()
@role_required('owner', 'admin')
def reject_booking(booking_id):
    """Reject booking (Owner/Admin only)"""
    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)
        
        data = request.get_json()
        
        booking = Booking.query.get(booking_id)
        
        if not booking:
            return jsonify({'message': 'Booking not found'}), 404
        
        # Check permission
        if user.role == 'owner' and booking.apartment.owner_id != current_user_id:
            return jsonify({'message': 'You can only reject bookings for your apartments'}), 403
        
        if booking.status != 'pending':
            return jsonify({'message': f'Booking is already {booking.status}'}), 400
        
        # Update booking status
        booking.status = 'rejected'
        booking.rejection_reason = data.get('reason', 'No reason provided')
        booking.approved_by = current_user_id
        booking.approved_at = datetime.utcnow()
        
        db.session.commit()
        
        # Create notification for tenant
        create_notification(
            user_id=booking.tenant_id,
            title='Booking Ditolak',
            message=f'Booking Anda untuk {booking.apartment.unit_number} ditolak. Alasan: {booking.rejection_reason}',
            notification_type='booking',
            related_id=booking.id
        )
        
        # Log activity
        log_activity(
            user_id=current_user_id,
            action='reject',
            entity_type='booking',
            entity_id=booking_id
        )
        
        return jsonify({
            'message': 'Booking rejected',
            'booking': booking.to_dict(include_relations=True)
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@bookings_bp.route('/<int:booking_id>/cancel', methods=['POST'])
@jwt_required()
def cancel_booking(booking_id):
    """Cancel booking"""
    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)
        
        booking = Booking.query.get(booking_id)
        
        if not booking:
            return jsonify({'message': 'Booking not found'}), 404
        
        # Check permission
        if user.role == 'tenant' and booking.tenant_id != current_user_id:
            return jsonify({'message': 'Access denied'}), 403
        
        if user.role == 'owner' and booking.apartment.owner_id != current_user_id:
            return jsonify({'message': 'Access denied'}), 403
        
        if booking.status not in ['pending', 'confirmed']:
            return jsonify({'message': f'Cannot cancel booking with status: {booking.status}'}), 400
        
        # Update booking status
        booking.status = 'cancelled'
        db.session.commit()
        
        # Create notification
        if user.role == 'tenant':
            # Notify owner
            create_notification(
                user_id=booking.apartment.owner_id,
                title='Booking Dibatalkan',
                message=f'Booking untuk {booking.apartment.unit_number} dibatalkan oleh penyewa',
                notification_type='booking',
                related_id=booking.id
            )
        else:
            # Notify tenant
            create_notification(
                user_id=booking.tenant_id,
                title='Booking Dibatalkan',
                message=f'Booking Anda untuk {booking.apartment.unit_number} telah dibatalkan',
                notification_type='booking',
                related_id=booking.id
            )
        
        # Log activity
        log_activity(
            user_id=current_user_id,
            action='cancel',
            entity_type='booking',
            entity_id=booking_id
        )
        
        return jsonify({
            'message': 'Booking cancelled successfully',
            'booking': booking.to_dict(include_relations=True)
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@bookings_bp.route('/<int:booking_id>', methods=['PUT'])
@jwt_required()
@role_required('admin')
def update_booking(booking_id):
    """Update booking (Admin only)"""
    try:
        current_user_id = int(get_jwt_identity())
        
        booking = Booking.query.get(booking_id)
        
        if not booking:
            return jsonify({'message': 'Booking not found'}), 404
        
        data = request.get_json()
        old_data = booking.to_dict()
        
        # Update fields
        updateable_fields = [
            'start_date', 'end_date', 'status', 'notes', 
            'contract_start_date', 'contract_end_date'
        ]
        
        for field in updateable_fields:
            if field in data:
                if 'date' in field and data[field]:
                    setattr(booking, field, datetime.strptime(data[field], '%Y-%m-%d').date())
                else:
                    setattr(booking, field, data[field])
        
        db.session.commit()
        
        # Log activity
        log_activity(
            user_id=current_user_id,
            action='update',
            entity_type='booking',
            entity_id=booking_id,
            old_data=old_data,
            new_data=booking.to_dict()
        )
        
        return jsonify({
            'message': 'Booking updated successfully',
            'booking': booking.to_dict(include_relations=True)
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500