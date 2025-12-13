# routes/reviews.py
from flask import Blueprint, request, jsonify
from models import db, Review, Apartment, Booking, User
from flask_jwt_extended import jwt_required, get_jwt_identity
from utils import role_required, create_notification, log_activity

reviews_bp = Blueprint('reviews', __name__, url_prefix='/api/reviews')

@reviews_bp.route('', methods=['POST'])
@jwt_required()
@role_required('tenant')
def create_review():
    """Create apartment review (Tenant only, must have completed booking)"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        required_fields = ['apartment_id', 'booking_id', 'rating']
        for field in required_fields:
            if field not in data:
                return jsonify({'message': f'{field} is required'}), 400
        
        # Check if booking exists and belongs to user
        booking = Booking.query.get(data['booking_id'])
        if not booking or booking.tenant_id != current_user_id:
            return jsonify({'message': 'Invalid booking'}), 400
        
        # Check if booking is completed
        if booking.status != 'completed':
            return jsonify({'message': 'Can only review completed bookings'}), 400
        
        # Check if already reviewed
        existing_review = Review.query.filter_by(
            booking_id=data['booking_id']
        ).first()
        
        if existing_review:
            return jsonify({'message': 'Booking already reviewed'}), 400
        
        # Validate rating
        if not (1 <= data['rating'] <= 5):
            return jsonify({'message': 'Rating must be between 1 and 5'}), 400
        
        # Create review
        review = Review(
            apartment_id=data['apartment_id'],
            tenant_id=current_user_id,
            booking_id=data['booking_id'],
            rating=data['rating'],
            review_text=data.get('review_text')
        )
        
        db.session.add(review)
        db.session.flush()
        
        # Update apartment average rating
        apartment = Apartment.query.get(data['apartment_id'])
        reviews = Review.query.filter_by(apartment_id=data['apartment_id'], is_approved=True).all()
        if reviews:
            avg_rating = sum(r.rating for r in reviews) / len(reviews)
            apartment.avg_rating = avg_rating
        
        db.session.commit()
        
        # Notify admin for approval
        admin_users = User.query.filter_by(role='admin').all()
        for admin in admin_users:
            create_notification(
                user_id=admin.id,
                title='Ulasan Baru',
                message=f'Ada ulasan baru untuk {apartment.unit_number}',
                notification_type='system',
                related_id=review.id
            )
        
        log_activity(
            user_id=current_user_id,
            action='create',
            entity_type='review',
            entity_id=review.id
        )
        
        return jsonify({
            'message': 'Review submitted successfully',
            'review': review.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@reviews_bp.route('/<int:review_id>/approve', methods=['POST'])
@jwt_required()
@role_required('admin')
def approve_review(review_id):
    """Approve review (Admin only)"""
    try:
        current_user_id = get_jwt_identity()
        
        review = Review.query.get(review_id)
        if not review:
            return jsonify({'message': 'Review not found'}), 404
        
        review.is_approved = True
        review.approved_by = current_user_id
        review.approved_at = datetime.utcnow()
        
        db.session.commit()
        
        create_notification(
            user_id=review.tenant_id,
            title='Ulasan Disetujui',
            message='Ulasan Anda telah disetujui dan dipublikasikan',
            notification_type='system'
        )
        
        return jsonify({
            'message': 'Review approved',
            'review': review.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@reviews_bp.route('/apartment/<int:apartment_id>', methods=['GET'])
def get_apartment_reviews(apartment_id):
    """Get reviews for an apartment"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        reviews = Review.query.filter_by(
            apartment_id=apartment_id,
            is_approved=True
        ).order_by(Review.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'reviews': [review.to_dict() for review in reviews.items],
            'pagination': {
                'page': reviews.page,
                'per_page': reviews.per_page,
                'total': reviews.total,
                'pages': reviews.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500