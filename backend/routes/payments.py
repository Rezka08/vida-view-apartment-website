from flask import Blueprint, request, jsonify
from models import db, Payment, Booking, User
from flask_jwt_extended import jwt_required, get_jwt_identity
from utils import role_required, generate_payment_code, create_notification, log_activity
from datetime import datetime

payments_bp = Blueprint('payments', __name__, url_prefix='/api/payments')

@payments_bp.route('', methods=['GET'])
@jwt_required()
def get_payments():
    """Get payments based on user role"""
    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status')
        
        # Build query based on role
        if user.role == 'tenant':
            query = Payment.query.join(Booking).filter(Booking.tenant_id == current_user_id)
        elif user.role == 'owner':
            from models import Apartment
            query = Payment.query.join(Booking).join(Apartment).filter(Apartment.owner_id == current_user_id)
        else:  # admin
            query = Payment.query
        
        # Apply filters
        if status:
            query = query.filter(Payment.payment_status == status)
        
        # Order by created_at desc
        query = query.order_by(Payment.created_at.desc())
        
        # Paginate
        payments = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'payments': [payment.to_dict() for payment in payments.items],
            'pagination': {
                'page': payments.page,
                'per_page': payments.per_page,
                'total': payments.total,
                'pages': payments.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@payments_bp.route('/<int:payment_id>', methods=['GET'])
@jwt_required()
def get_payment(payment_id):
    """Get single payment details"""
    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)
        
        payment = Payment.query.get(payment_id)
        
        if not payment:
            return jsonify({'message': 'Payment not found'}), 404
        
        # Check access permission
        booking = payment.booking
        # Admin can access all
        if user.role == 'admin':
            pass  # Admin has full access
        # Tenant can only access their own payments
        elif user.role == 'tenant':
            if booking.tenant_id != current_user_id:
                return jsonify({'message': 'Access denied'}), 403
        # Owner can only access payments for their apartments
        elif user.role == 'owner':
            if booking.apartment.owner_id != current_user_id:
                return jsonify({'message': 'Access denied'}), 403
        
        data = payment.to_dict()
        data['booking'] = booking.to_dict(include_relations=True)
        
        return jsonify(data), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@payments_bp.route('', methods=['POST'])
@jwt_required()
@role_required('admin')
def create_payment():
    """Create new payment record (Admin only)"""
    try:
        current_user_id = int(get_jwt_identity())
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['booking_id', 'payment_type', 'amount']
        for field in required_fields:
            if field not in data:
                return jsonify({'message': f'{field} is required'}), 400
        
        # Check if booking exists
        booking = Booking.query.get(data['booking_id'])
        if not booking:
            return jsonify({'message': 'Booking not found'}), 404
        
        # Create payment
        payment = Payment(
            booking_id=data['booking_id'],
            payment_code=generate_payment_code(),
            payment_type=data['payment_type'],
            amount=data['amount'],
            payment_method=data.get('payment_method'),
            payment_status='pending',
            due_date=data.get('due_date'),
            notes=data.get('notes')
        )
        
        db.session.add(payment)
        db.session.commit()
        
        # Create notification
        create_notification(
            user_id=booking.tenant_id,
            title='Tagihan Baru',
            message=f'Anda memiliki tagihan baru sebesar Rp {payment.amount:,.0f}',
            notification_type='payment',
            related_id=payment.id
        )
        
        # Log activity
        log_activity(
            user_id=current_user_id,
            action='create',
            entity_type='payment',
            entity_id=payment.id,
            new_data=payment.to_dict()
        )
        
        return jsonify({
            'message': 'Payment created successfully',
            'payment': payment.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@payments_bp.route('/<int:payment_id>/confirm', methods=['POST'])
@jwt_required()
def confirm_payment(payment_id):
    """Confirm payment (upload proof)"""
    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)
        
        payment = Payment.query.get(payment_id)
        
        if not payment:
            return jsonify({'message': 'Payment not found'}), 404
        
        # Check permission (tenant can confirm their own payments)
        booking = payment.booking
        if user.role == 'tenant' and booking.tenant_id != current_user_id:
            return jsonify({'message': 'Access denied'}), 403
        
        if payment.payment_status != 'pending':
            return jsonify({'message': f'Payment is already {payment.payment_status}'}), 400
        
        data = request.get_json()
        
        # Update payment
        payment.payment_method = data.get('payment_method', payment.payment_method)
        payment.transaction_id = data.get('transaction_id')
        payment.payment_date = datetime.utcnow()
        payment.notes = data.get('notes', payment.notes)

        # For admin, mark as completed directly
        if user.role == 'admin':
            payment.payment_status = 'completed'
        else:
            # For tenant, change status to 'verifying' (waiting for owner/admin confirmation)
            payment.payment_status = 'verifying'

        db.session.commit()

        # Create notification for admin and owner
        admin_users = User.query.filter_by(role='admin').all()
        for admin in admin_users:
            create_notification(
                user_id=admin.id,
                title='Konfirmasi Pembayaran',
                message=f'Pembayaran {payment.payment_code} menunggu konfirmasi',
                notification_type='payment',
                related_id=payment.id
            )

        # Notify owner
        apartment_owner = booking.apartment.owner
        if apartment_owner:
            create_notification(
                user_id=apartment_owner.id,
                title='Konfirmasi Pembayaran',
                message=f'Pembayaran {payment.payment_code} dari {booking.tenant.full_name} menunggu konfirmasi',
                notification_type='payment',
                related_id=payment.id
            )

        # Log activity
        log_activity(
            user_id=current_user_id,
            action='confirm',
            entity_type='payment',
            entity_id=payment_id
        )
        
        return jsonify({
            'message': 'Payment confirmed successfully',
            'payment': payment.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@payments_bp.route('/<int:payment_id>/verify', methods=['POST'])
@jwt_required()
@role_required('owner', 'admin')
def verify_payment(payment_id):
    """Verify payment (Owner/Admin only)"""
    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)
        
        payment = Payment.query.get(payment_id)
        
        if not payment:
            return jsonify({'message': 'Payment not found'}), 404
        
        # Check permission for owner
        booking = payment.booking
        if user.role == 'owner' and booking.apartment.owner_id != current_user_id:
            return jsonify({'message': 'Access denied'}), 403
        
        data = request.get_json()
        is_approved = data.get('approved', True)
        
        if is_approved:
            payment.payment_status = 'completed'

            # If this is deposit payment, update booking status and set contract dates
            if payment.payment_type == 'deposit':
                booking.status = 'active'
                # Update apartment status
                booking.apartment.availability_status = 'occupied'

                # Set contract dates - contract starts from booking start_date
                booking.contract_start_date = booking.start_date
                booking.contract_end_date = booking.end_date

            # Create notification for tenant
            create_notification(
                user_id=booking.tenant_id,
                title='Pembayaran Diverifikasi',
                message=f'Pembayaran {payment.payment_code} telah diverifikasi',
                notification_type='payment',
                related_id=payment.id
            )
        else:
            payment.payment_status = 'failed'
            payment.notes = data.get('notes', 'Payment verification failed')
            
            # Create notification for tenant
            create_notification(
                user_id=booking.tenant_id,
                title='Pembayaran Ditolak',
                message=f'Pembayaran {payment.payment_code} ditolak. Silakan hubungi admin.',
                notification_type='payment',
                related_id=payment.id
            )
        
        db.session.commit()
        
        # Log activity
        log_activity(
            user_id=current_user_id,
            action='verify',
            entity_type='payment',
            entity_id=payment_id
        )
        
        return jsonify({
            'message': 'Payment verification updated',
            'payment': payment.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@payments_bp.route('/booking/<int:booking_id>', methods=['GET'])
@jwt_required()
def get_booking_payments(booking_id):
    """Get all payments for a booking"""
    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)
        
        booking = Booking.query.get(booking_id)
        
        if not booking:
            return jsonify({'message': 'Booking not found'}), 404
        
        # Check permission
        # Admin can access all
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
        
        payments = Payment.query.filter_by(booking_id=booking_id).order_by(Payment.created_at.desc()).all()
        
        return jsonify({
            'payments': [payment.to_dict() for payment in payments]
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500