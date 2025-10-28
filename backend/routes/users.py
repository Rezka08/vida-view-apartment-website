from flask import Blueprint, request, jsonify
from models import db, User
from flask_jwt_extended import jwt_required, get_jwt_identity
from utils import role_required, save_file, log_activity
from datetime import datetime

users_bp = Blueprint('users', __name__, url_prefix='/api/users')

@users_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user profile"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        return jsonify(user.to_dict(include_sensitive=True)), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@users_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update current user profile"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        data = request.get_json()
        old_data = user.to_dict()
        
        # Update allowed fields
        updateable_fields = ['full_name', 'phone', 'address', 'birth_date']
        
        for field in updateable_fields:
            if field in data:
                if field == 'birth_date' and data[field]:
                    setattr(user, field, datetime.strptime(data[field], '%Y-%m-%d').date())
                else:
                    setattr(user, field, data[field])
        
        db.session.commit()
        
        # Log activity
        log_activity(
            user_id=current_user_id,
            action='update',
            entity_type='user',
            entity_id=current_user_id,
            old_data=old_data,
            new_data=user.to_dict()
        )
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict(include_sensitive=True)
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@users_bp.route('/profile/photo', methods=['POST'])
@jwt_required()
def upload_profile_photo():
    """Upload profile photo"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        if 'photo' not in request.files:
            return jsonify({'message': 'No photo file provided'}), 400
        
        file = request.files['photo']
        photo_url = save_file(file, 'profiles')
        
        if not photo_url:
            return jsonify({'message': 'Invalid file type'}), 400
        
        user.profile_photo = photo_url
        db.session.commit()
        
        return jsonify({
            'message': 'Profile photo uploaded successfully',
            'photo_url': photo_url
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@users_bp.route('/profile/documents', methods=['POST'])
@jwt_required()
def upload_documents():
    """Upload ID card and other documents"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        if 'id_card' in request.files:
            file = request.files['id_card']
            photo_url = save_file(file, 'documents')
            
            if photo_url:
                user.id_card_photo = photo_url
        
        if 'id_card_number' in request.form:
            user.id_card_number = request.form['id_card_number']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Documents uploaded successfully',
            'user': user.to_dict(include_sensitive=True)
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@users_bp.route('', methods=['GET'])
@jwt_required()
@role_required('admin')
def get_users():
    """Get all users (Admin only)"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        role = request.args.get('role')
        status = request.args.get('status')
        search = request.args.get('search')
        
        query = User.query
        
        # Apply filters
        if role:
            query = query.filter(User.role == role)
        
        if status:
            query = query.filter(User.status == status)
        
        if search:
            from sqlalchemy import or_
            query = query.filter(
                or_(
                    User.username.contains(search),
                    User.email.contains(search),
                    User.full_name.contains(search)
                )
            )
        
        # Order by created_at desc
        query = query.order_by(User.created_at.desc())
        
        # Paginate
        users = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'users': [user.to_dict() for user in users.items],
            'pagination': {
                'page': users.page,
                'per_page': users.per_page,
                'total': users.total,
                'pages': users.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@users_bp.route('/<int:user_id>', methods=['GET'])
@jwt_required()
@role_required('admin')
def get_user(user_id):
    """Get user details (Admin only)"""
    try:
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        return jsonify(user.to_dict(include_sensitive=True)), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@users_bp.route('/<int:user_id>', methods=['PUT'])
@jwt_required()
@role_required('admin')
def update_user(user_id):
    """Update user (Admin only)"""
    try:
        current_user_id = get_jwt_identity()
        
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        data = request.get_json()
        old_data = user.to_dict()
        
        # Update allowed fields
        updateable_fields = [
            'username', 'email', 'full_name', 'phone', 'role',
            'address', 'birth_date', 'status'
        ]
        
        for field in updateable_fields:
            if field in data:
                if field == 'birth_date' and data[field]:
                    setattr(user, field, datetime.strptime(data[field], '%Y-%m-%d').date())
                else:
                    setattr(user, field, data[field])
        
        # Update password if provided
        if 'password' in data:
            user.set_password(data['password'])
        
        db.session.commit()
        
        # Log activity
        log_activity(
            user_id=current_user_id,
            action='update',
            entity_type='user',
            entity_id=user_id,
            old_data=old_data,
            new_data=user.to_dict()
        )
        
        return jsonify({
            'message': 'User updated successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@users_bp.route('/<int:user_id>', methods=['DELETE'])
@jwt_required()
@role_required('admin')
def delete_user(user_id):
    """Delete user (Admin only)"""
    try:
        current_user_id = get_jwt_identity()
        
        if user_id == current_user_id:
            return jsonify({'message': 'Cannot delete your own account'}), 400
        
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        old_data = user.to_dict()
        
        db.session.delete(user)
        db.session.commit()
        
        # Log activity
        log_activity(
            user_id=current_user_id,
            action='delete',
            entity_type='user',
            entity_id=user_id,
            old_data=old_data
        )
        
        return jsonify({
            'message': 'User deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@users_bp.route('/<int:user_id>/verify-documents', methods=['POST'])
@jwt_required()
@role_required('admin')
def verify_documents(user_id):
    """Verify user documents (Admin only)"""
    try:
        current_user_id = get_jwt_identity()
        
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        user.document_verified_at = datetime.utcnow()
        db.session.commit()
        
        from utils import create_notification
        create_notification(
            user_id=user_id,
            title='Dokumen Terverifikasi',
            message='Dokumen identitas Anda telah terverifikasi',
            notification_type='system'
        )
        
        # Log activity
        log_activity(
            user_id=current_user_id,
            action='verify_documents',
            entity_type='user',
            entity_id=user_id
        )
        
        return jsonify({
            'message': 'Documents verified successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500