from flask import Blueprint, request, jsonify
from models import db, Promotion, Apartment
from flask_jwt_extended import jwt_required, get_jwt_identity
from utils import role_required, log_activity
from datetime import datetime

promotions_bp = Blueprint('promotions', __name__, url_prefix='/api/promotions')

@promotions_bp.route('', methods=['GET'])
def get_promotions():
    """Get all promotions (admin can see all, others only active)"""
    try:
        # Get current user if authenticated
        current_user_id = None
        is_admin = False
        try:
            from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
            from models import User
            verify_jwt_in_request(optional=True)
            jwt_identity = get_jwt_identity()
            if jwt_identity:
                current_user_id = int(jwt_identity)
                user = User.query.get(current_user_id)
                is_admin = user and user.role == 'admin'
        except:
            pass

        # Build query
        query = Promotion.query

        # If not admin, only show active promotions
        if not is_admin:
            query = query.filter(Promotion.active == True)

        # Get filter parameters
        status = request.args.get('status')
        if status:
            active = status == 'active'
            query = query.filter(Promotion.active == active)

        promo_type = request.args.get('type')
        if promo_type:
            query = query.filter(Promotion.type == promo_type)

        # Order by created_at desc
        promotions = query.order_by(Promotion.created_at.desc()).all()

        return jsonify({
            'promotions': [promo.to_dict() for promo in promotions],
            'total': len(promotions)
        }), 200

    except Exception as e:
        return jsonify({'message': str(e)}), 500


@promotions_bp.route('/<int:promotion_id>', methods=['GET'])
def get_promotion(promotion_id):
    """Get single promotion"""
    try:
        promotion = Promotion.query.get(promotion_id)

        if not promotion:
            return jsonify({'message': 'Promotion not found'}), 404

        return jsonify({
            'promotion': promotion.to_dict()
        }), 200

    except Exception as e:
        return jsonify({'message': str(e)}), 500


@promotions_bp.route('', methods=['POST'])
@jwt_required()
@role_required('admin')
def create_promotion():
    """Create new promotion (Admin only)"""
    try:
        current_user_id = int(get_jwt_identity())
        data = request.get_json()

        # Validate required fields
        required_fields = ['code', 'title', 'type', 'value']
        for field in required_fields:
            if field not in data:
                return jsonify({'message': f'{field} is required'}), 400

        # Get and validate promo code
        promo_code = data['code'].upper().strip()

        # Check if code already exists
        if Promotion.query.filter_by(code=promo_code).first():
            return jsonify({'message': 'Kode promosi sudah digunakan'}), 400

        # Parse dates
        start_date = None
        end_date = None
        if data.get('start_date'):
            start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
        if data.get('end_date'):
            end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date()

        # Validate dates
        if start_date and end_date and end_date < start_date:
            return jsonify({'message': 'End date must be after start date'}), 400

        # Create promotion
        promotion = Promotion(
            code=promo_code,
            title=data['title'],
            description=data.get('description'),
            type=data['type'],
            value=data['value'],
            apartment_id=data.get('apartment_id'),
            start_date=start_date,
            end_date=end_date,
            min_nights=data.get('min_nights'),
            active=data.get('active', True),
            usage_limit=data.get('usage_limit')
        )

        db.session.add(promotion)
        db.session.commit()

        # Log activity
        log_activity(
            user_id=current_user_id,
            action='create',
            entity_type='promotion',
            entity_id=promotion.id,
            new_data=promotion.to_dict()
        )

        return jsonify({
            'message': 'Promotion created successfully',
            'promotion': promotion.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500


@promotions_bp.route('/<int:promotion_id>', methods=['PUT'])
@jwt_required()
@role_required('admin')
def update_promotion(promotion_id):
    """Update promotion (Admin only)"""
    try:
        current_user_id = int(get_jwt_identity())
        promotion = Promotion.query.get(promotion_id)

        if not promotion:
            return jsonify({'message': 'Promotion not found'}), 404

        data = request.get_json()
        old_data = promotion.to_dict()

        # Update code if provided
        if 'code' in data:
            new_code = data['code'].upper().strip()
            # Check if code already exists (exclude current promotion)
            existing_promo = Promotion.query.filter_by(code=new_code).first()
            if existing_promo and existing_promo.id != promotion_id:
                return jsonify({'message': 'Kode promosi sudah digunakan'}), 400
            promotion.code = new_code

        # Update fields
        updatable_fields = [
            'title', 'description', 'type', 'value', 'apartment_id',
            'min_nights', 'active', 'usage_limit'
        ]

        for field in updatable_fields:
            if field in data:
                setattr(promotion, field, data[field])

        # Update dates
        if 'start_date' in data and data['start_date']:
            promotion.start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
        if 'end_date' in data and data['end_date']:
            promotion.end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date()

        # Validate dates
        if promotion.start_date and promotion.end_date and promotion.end_date < promotion.start_date:
            return jsonify({'message': 'End date must be after start date'}), 400

        db.session.commit()

        # Log activity
        log_activity(
            user_id=current_user_id,
            action='update',
            entity_type='promotion',
            entity_id=promotion_id,
            old_data=old_data,
            new_data=promotion.to_dict()
        )

        return jsonify({
            'message': 'Promotion updated successfully',
            'promotion': promotion.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500


@promotions_bp.route('/<int:promotion_id>', methods=['DELETE'])
@jwt_required()
@role_required('admin')
def delete_promotion(promotion_id):
    """Delete promotion (Admin only)"""
    try:
        current_user_id = int(get_jwt_identity())
        promotion = Promotion.query.get(promotion_id)

        if not promotion:
            return jsonify({'message': 'Promotion not found'}), 404

        old_data = promotion.to_dict()

        db.session.delete(promotion)
        db.session.commit()

        # Log activity
        log_activity(
            user_id=current_user_id,
            action='delete',
            entity_type='promotion',
            entity_id=promotion_id,
            old_data=old_data
        )

        return jsonify({
            'message': 'Promotion deleted successfully'
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500


@promotions_bp.route('/validate/<code>', methods=['GET'])
def validate_promo_code(code):
    """Validate promo code"""
    try:
        promotion = Promotion.query.filter_by(code=code.upper(), active=True).first()

        if not promotion:
            return jsonify({'valid': False, 'message': 'Invalid promo code'}), 404

        # Check if promotion is expired
        today = datetime.now().date()
        if promotion.start_date and today < promotion.start_date:
            return jsonify({'valid': False, 'message': 'Promo code not yet active'}), 400

        if promotion.end_date and today > promotion.end_date:
            return jsonify({'valid': False, 'message': 'Promo code has expired'}), 400

        return jsonify({
            'valid': True,
            'promotion': promotion.to_dict()
        }), 200

    except Exception as e:
        return jsonify({'message': str(e)}), 500
