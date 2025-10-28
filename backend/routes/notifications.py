# routes/notifications.py
from flask import Blueprint, request, jsonify
from models import db, Notification
from flask_jwt_extended import jwt_required, get_jwt_identity

notifications_bp = Blueprint('notifications', __name__, url_prefix='/api/notifications')

@notifications_bp.route('', methods=['GET'])
@jwt_required()
def get_notifications():
    """Get user notifications"""
    try:
        current_user_id = get_jwt_identity()
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        is_read = request.args.get('is_read', type=bool)
        
        query = Notification.query.filter_by(user_id=current_user_id)
        
        if is_read is not None:
            query = query.filter_by(is_read=is_read)
        
        query = query.order_by(Notification.created_at.desc())
        
        notifications = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'notifications': [notif.to_dict() for notif in notifications.items],
            'pagination': {
                'page': notifications.page,
                'per_page': notifications.per_page,
                'total': notifications.total,
                'pages': notifications.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@notifications_bp.route('/<int:notification_id>/read', methods=['POST'])
@jwt_required()
def mark_as_read(notification_id):
    """Mark notification as read"""
    try:
        current_user_id = get_jwt_identity()
        
        notification = Notification.query.get(notification_id)
        
        if not notification:
            return jsonify({'message': 'Notification not found'}), 404
        
        if notification.user_id != current_user_id:
            return jsonify({'message': 'Access denied'}), 403
        
        notification.is_read = True
        db.session.commit()
        
        return jsonify({
            'message': 'Notification marked as read'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@notifications_bp.route('/mark-all-read', methods=['POST'])
@jwt_required()
def mark_all_read():
    """Mark all notifications as read"""
    try:
        current_user_id = get_jwt_identity()
        
        Notification.query.filter_by(
            user_id=current_user_id,
            is_read=False
        ).update({'is_read': True})
        
        db.session.commit()
        
        return jsonify({
            'message': 'All notifications marked as read'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@notifications_bp.route('/unread-count', methods=['GET'])
@jwt_required()
def get_unread_count():
    """Get unread notifications count"""
    try:
        current_user_id = get_jwt_identity()
        
        count = Notification.query.filter_by(
            user_id=current_user_id,
            is_read=False
        ).count()
        
        return jsonify({
            'unread_count': count
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@notifications_bp.route('/<int:notification_id>', methods=['DELETE'])
@jwt_required()
def delete_notification(notification_id):
    """Delete notification"""
    try:
        current_user_id = get_jwt_identity()
        
        notification = Notification.query.get(notification_id)
        
        if not notification:
            return jsonify({'message': 'Notification not found'}), 404
        
        if notification.user_id != current_user_id:
            return jsonify({'message': 'Access denied'}), 403
        
        db.session.delete(notification)
        db.session.commit()
        
        return jsonify({
            'message': 'Notification deleted'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500