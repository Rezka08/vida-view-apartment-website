from flask import Blueprint, request, jsonify
from models import db, Facility
from flask_jwt_extended import jwt_required
from utils import role_required, log_activity

facilities_bp = Blueprint('facilities', __name__, url_prefix='/api/facilities')

@facilities_bp.route('', methods=['GET'])
def get_facilities():
    """Get all facilities"""
    try:
        category = request.args.get('category')
        status = request.args.get('status', 'active')
        
        query = Facility.query
        
        if category:
            query = query.filter_by(category=category)
        
        if status:
            query = query.filter_by(status=status)
        
        facilities = query.all()
        
        return jsonify({
            'facilities': [facility.to_dict() for facility in facilities]
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@facilities_bp.route('', methods=['POST'])
@jwt_required()
@role_required('admin')
def create_facility():
    """Create new facility (Admin only)"""
    try:
        from flask_jwt_extended import get_jwt_identity
        current_user_id = get_jwt_identity()
        
        data = request.get_json()
        
        if not data.get('name'):
            return jsonify({'message': 'Name is required'}), 400
        
        facility = Facility(
            name=data['name'],
            description=data.get('description'),
            icon=data.get('icon'),
            category=data.get('category', 'building'),
            status=data.get('status', 'active')
        )
        
        db.session.add(facility)
        db.session.commit()
        
        log_activity(
            user_id=current_user_id,
            action='create',
            entity_type='facility',
            entity_id=facility.id,
            new_data=facility.to_dict()
        )
        
        return jsonify({
            'message': 'Facility created successfully',
            'facility': facility.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@facilities_bp.route('/<int:facility_id>', methods=['PUT'])
@jwt_required()
@role_required('admin')
def update_facility(facility_id):
    """Update facility (Admin only)"""
    try:
        from flask_jwt_extended import get_jwt_identity
        current_user_id = get_jwt_identity()
        
        facility = Facility.query.get(facility_id)
        if not facility:
            return jsonify({'message': 'Facility not found'}), 404
        
        data = request.get_json()
        old_data = facility.to_dict()
        
        updateable_fields = ['name', 'description', 'icon', 'category', 'status']
        for field in updateable_fields:
            if field in data:
                setattr(facility, field, data[field])
        
        db.session.commit()
        
        log_activity(
            user_id=current_user_id,
            action='update',
            entity_type='facility',
            entity_id=facility_id,
            old_data=old_data,
            new_data=facility.to_dict()
        )
        
        return jsonify({
            'message': 'Facility updated successfully',
            'facility': facility.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@facilities_bp.route('/<int:facility_id>', methods=['DELETE'])
@jwt_required()
@role_required('admin')
def delete_facility(facility_id):
    """Delete facility (Admin only)"""
    try:
        from flask_jwt_extended import get_jwt_identity
        current_user_id = get_jwt_identity()
        
        facility = Facility.query.get(facility_id)
        if not facility:
            return jsonify({'message': 'Facility not found'}), 404
        
        old_data = facility.to_dict()
        
        db.session.delete(facility)
        db.session.commit()
        
        log_activity(
            user_id=current_user_id,
            action='delete',
            entity_type='facility',
            entity_id=facility_id,
            old_data=old_data
        )
        
        return jsonify({
            'message': 'Facility deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500