from flask import Blueprint, request, jsonify
from models import db, Apartment, UnitPhoto, Facility, ApartmentFacility, Review, Favorite, User, Booking
from flask_jwt_extended import jwt_required, get_jwt_identity
from utils import role_required, paginate_query, save_file, log_activity
from sqlalchemy import or_, and_

apartments_bp = Blueprint('apartments', __name__, url_prefix='/api/apartments')

@apartments_bp.route('', methods=['GET'])
def get_apartments():
    """Get all apartments with filters (excludes archived for public)"""
    try:
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        unit_type = request.args.get('unit_type')
        min_price = request.args.get('min_price', type=float)
        max_price = request.args.get('max_price', type=float)
        bedrooms = request.args.get('bedrooms', type=int)
        furnished = request.args.get('furnished', type=bool)
        status = request.args.get('status', 'available')
        search = request.args.get('search')

        # Build query - EXCLUDE archived apartments for public listing
        query = Apartment.query.filter(Apartment.is_archived == False)

        # Apply filters
        if unit_type:
            query = query.filter(Apartment.unit_type == unit_type)

        if min_price:
            query = query.filter(Apartment.price_per_month >= min_price)

        if max_price:
            query = query.filter(Apartment.price_per_month <= max_price)

        if bedrooms:
            query = query.filter(Apartment.bedrooms == bedrooms)

        if furnished is not None:
            query = query.filter(Apartment.furnished == furnished)

        if status:
            query = query.filter(Apartment.availability_status == status)

        if search:
            query = query.filter(
                or_(
                    Apartment.unit_number.contains(search),
                    Apartment.description.contains(search)
                )
            )

        # Order by created_at desc
        query = query.order_by(Apartment.created_at.desc())

        # Paginate
        result = paginate_query(query, page, per_page)

        # Format response
        apartments = [apt.to_dict(include_relations=True) for apt in result['items']]

        return jsonify({
            'apartments': apartments,
            'pagination': {
                'page': result['page'],
                'per_page': result['per_page'],
                'total': result['total'],
                'pages': result['pages'],
                'has_next': result['has_next'],
                'has_prev': result['has_prev']
            }
        }), 200

    except Exception as e:
        return jsonify({'message': str(e)}), 500

@apartments_bp.route('/my-units', methods=['GET'])
@jwt_required()
@role_required('owner')
def get_my_units():
    """Get apartments owned by current user including archived (Owner only)"""
    try:
        current_user_id = int(get_jwt_identity())

        # Get query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status')
        include_archived = request.args.get('include_archived', 'true')  # By default, show all including archived

        # Build query - filter by owner (INCLUDE archived units)
        query = Apartment.query.filter_by(owner_id=current_user_id)

        # Optional: filter out archived if requested
        if include_archived.lower() == 'false':
            query = query.filter(Apartment.is_archived == False)

        # Apply status filter
        if status:
            query = query.filter(Apartment.availability_status == status)

        # Order by: non-archived first, then by created_at desc
        query = query.order_by(Apartment.is_archived.asc(), Apartment.created_at.desc())

        # Paginate
        result = paginate_query(query, page, per_page)

        # Format response
        apartments = [apt.to_dict(include_relations=True) for apt in result['items']]

        return jsonify({
            'apartments': apartments,
            'pagination': {
                'page': result['page'],
                'per_page': result['per_page'],
                'total': result['total'],
                'pages': result['pages'],
                'has_next': result['has_next'],
                'has_prev': result['has_prev']
            }
        }), 200

    except Exception as e:
        return jsonify({'message': str(e)}), 500

@apartments_bp.route('/<int:apartment_id>', methods=['GET'])
def get_apartment(apartment_id):
    """Get single apartment details"""
    try:
        from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
        from models import Booking

        apartment = Apartment.query.get(apartment_id)

        if not apartment:
            return jsonify({'message': 'Apartment not found'}), 404

        # Check if apartment is archived
        if apartment.is_archived:
            # Get current user (if logged in)
            current_user_id = None
            try:
                verify_jwt_in_request(optional=True)
                jwt_identity = get_jwt_identity()
                if jwt_identity:
                    current_user_id = int(jwt_identity)
            except:
                pass

            # Check access permission for archived apartment
            has_access = False

            if current_user_id:
                # Check if user is the owner
                if apartment.owner_id == current_user_id:
                    has_access = True
                else:
                    # Check if user has active/existing booking for this apartment
                    user_booking = Booking.query.filter(
                        Booking.apartment_id == apartment_id,
                        Booking.tenant_id == current_user_id,
                        Booking.status.in_(['pending', 'confirmed', 'active', 'completed'])
                    ).first()

                    if user_booking:
                        has_access = True

            # If no access, return 404 (hide that apartment exists)
            if not has_access:
                return jsonify({'message': 'Apartment not found'}), 404

        # Increment view count (only if not archived or has access)
        apartment.total_views += 1
        db.session.commit()

        # Get reviews
        reviews = Review.query.filter_by(
            apartment_id=apartment_id,
            is_approved=True
        ).order_by(Review.created_at.desc()).limit(10).all()

        data = apartment.to_dict(include_relations=True)
        data['reviews'] = [review.to_dict() for review in reviews]

        return jsonify(data), 200

    except Exception as e:
        return jsonify({'message': str(e)}), 500

@apartments_bp.route('', methods=['POST'])
@jwt_required()
@role_required('owner', 'admin')
def create_apartment():
    """Create new apartment (Owner/Admin only)"""
    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['unit_number', 'unit_type', 'price_per_month']
        for field in required_fields:
            if field not in data:
                return jsonify({'message': f'{field} is required'}), 400
        
        # Check if unit number already exists
        if Apartment.query.filter_by(unit_number=data['unit_number']).first():
            return jsonify({'message': 'Unit number already exists'}), 400
        
        # Create apartment
        apartment = Apartment(
            unit_number=data['unit_number'],
            unit_type=data['unit_type'],
            floor=data.get('floor'),
            size_sqm=data.get('size_sqm'),
            bedrooms=data.get('bedrooms'),
            bathrooms=data.get('bathrooms'),
            price_per_month=data['price_per_month'],
            deposit_amount=data.get('deposit_amount'),
            minimum_stay_months=data.get('minimum_stay_months', 1),
            description=data.get('description'),
            furnished=data.get('furnished', False),
            view_direction=data.get('view_direction'),
            electricity_watt=data.get('electricity_watt'),
            water_source=data.get('water_source'),
            parking_slots=data.get('parking_slots'),
            pet_friendly=data.get('pet_friendly', False),
            smoking_allowed=data.get('smoking_allowed', False),
            owner_id=current_user_id if user.role == 'owner' else data.get('owner_id')
        )
        
        db.session.add(apartment)
        db.session.flush()  # Get apartment ID
        
        # Add facilities if provided
        if 'facility_ids' in data:
            for facility_id in data['facility_ids']:
                apt_facility = ApartmentFacility(
                    apartment_id=apartment.id,
                    facility_id=facility_id
                )
                db.session.add(apt_facility)
        
        db.session.commit()
        
        # Log activity
        log_activity(
            user_id=current_user_id,
            action='create',
            entity_type='apartment',
            entity_id=apartment.id,
            new_data=apartment.to_dict()
        )
        
        return jsonify({
            'message': 'Apartment created successfully',
            'apartment': apartment.to_dict(include_relations=True)
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@apartments_bp.route('/<int:apartment_id>', methods=['PUT'])
@jwt_required()
@role_required('owner', 'admin')
def update_apartment(apartment_id):
    """Update apartment (Owner/Admin only)"""
    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)
        
        apartment = Apartment.query.get(apartment_id)
        
        if not apartment:
            return jsonify({'message': 'Apartment not found'}), 404
        
        # Check ownership (unless admin)
        if user.role == 'owner' and apartment.owner_id != current_user_id:
            return jsonify({'message': 'You can only update your own apartments'}), 403
        
        data = request.get_json()
        old_data = apartment.to_dict()
        
        # Update fields
        updateable_fields = [
            'unit_type', 'floor', 'size_sqm', 'bedrooms', 'bathrooms',
            'price_per_month', 'deposit_amount', 'minimum_stay_months',
            'description', 'furnished', 'view_direction', 'electricity_watt',
            'water_source', 'parking_slots', 'pet_friendly', 'smoking_allowed',
            'availability_status'
        ]
        
        for field in updateable_fields:
            if field in data:
                setattr(apartment, field, data[field])
        
        # Update facilities if provided
        if 'facility_ids' in data:
            # Remove existing facilities
            ApartmentFacility.query.filter_by(apartment_id=apartment_id).delete()
            
            # Add new facilities
            for facility_id in data['facility_ids']:
                apt_facility = ApartmentFacility(
                    apartment_id=apartment_id,
                    facility_id=facility_id
                )
                db.session.add(apt_facility)
        
        db.session.commit()
        
        # Log activity
        log_activity(
            user_id=current_user_id,
            action='update',
            entity_type='apartment',
            entity_id=apartment_id,
            old_data=old_data,
            new_data=apartment.to_dict()
        )
        
        return jsonify({
            'message': 'Apartment updated successfully',
            'apartment': apartment.to_dict(include_relations=True)
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@apartments_bp.route('/<int:apartment_id>/has-bookings', methods=['GET'])
@jwt_required()
@role_required('owner', 'admin')
def check_apartment_bookings(apartment_id):
    """Check if apartment has any bookings"""
    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)

        apartment = Apartment.query.get(apartment_id)

        if not apartment:
            return jsonify({'message': 'Apartment not found'}), 404

        # Check ownership (unless admin)
        if user.role == 'owner' and apartment.owner_id != current_user_id:
            return jsonify({'message': 'Unauthorized'}), 403

        # Check if apartment has any bookings (excluding cancelled/rejected)
        bookings = Booking.query.filter(
            Booking.apartment_id == apartment_id,
            Booking.status.in_(['pending', 'confirmed', 'active', 'completed'])
        ).all()

        has_bookings = len(bookings) > 0

        return jsonify({
            'has_bookings': has_bookings,
            'booking_count': len(bookings)
        }), 200

    except Exception as e:
        return jsonify({'message': str(e)}), 500


@apartments_bp.route('/<int:apartment_id>', methods=['DELETE'])
@jwt_required()
@role_required('owner', 'admin')
def delete_apartment(apartment_id):
    """Delete or Archive apartment - Owner/Admin only

    Query params:
    - action: 'delete' for hard delete (only if no bookings), 'archive' for soft delete
    """
    try:
        from datetime import datetime
        from flask import request
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)

        apartment = Apartment.query.get(apartment_id)

        if not apartment:
            return jsonify({'message': 'Apartment not found'}), 404

        # Check ownership (unless admin)
        if user.role == 'owner' and apartment.owner_id != current_user_id:
            return jsonify({'message': 'You can only delete/archive your own apartments'}), 403

        # Get action parameter (default to 'archive' for backward compatibility)
        action = request.args.get('action', 'archive')

        # Check if apartment has bookings
        bookings = Booking.query.filter(
            Booking.apartment_id == apartment_id,
            Booking.status.in_(['pending', 'confirmed', 'active', 'completed'])
        ).all()

        has_bookings = len(bookings) > 0

        if action == 'delete':
            # Hard delete - only allowed if no bookings
            if has_bookings:
                return jsonify({
                    'message': 'Tidak dapat menghapus unit yang sudah memiliki booking. Gunakan fitur Arsip sebagai gantinya.',
                    'has_bookings': True
                }), 400

            old_data = apartment.to_dict()

            # Delete associated photos first
            UnitPhoto.query.filter_by(apartment_id=apartment_id).delete()

            # Delete associated facilities
            ApartmentFacility.query.filter_by(apartment_id=apartment_id).delete()

            # Hard delete the apartment
            db.session.delete(apartment)
            db.session.commit()

            # Log activity
            log_activity(
                user_id=current_user_id,
                action='delete',
                entity_type='apartment',
                entity_id=apartment_id,
                old_data=old_data,
                new_data=None
            )

            return jsonify({
                'message': 'Apartemen berhasil dihapus permanen.',
                'deleted': True
            }), 200

        else:  # action == 'archive'
            # Soft delete: mark as archived
            if apartment.is_archived:
                return jsonify({'message': 'Apartemen sudah diarsipkan sebelumnya'}), 400

            old_data = apartment.to_dict()

            apartment.is_archived = True
            apartment.archived_at = datetime.utcnow()

            db.session.commit()

            # Log activity
            log_activity(
                user_id=current_user_id,
                action='archive',
                entity_type='apartment',
                entity_id=apartment_id,
                old_data=old_data,
                new_data=apartment.to_dict()
            )

            return jsonify({
                'message': 'Apartemen berhasil diarsipkan. Penyewa yang sudah booking masih bisa akses.',
                'apartment': apartment.to_dict(),
                'archived': True
            }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@apartments_bp.route('/<int:apartment_id>/photos', methods=['POST'])
@jwt_required()
@role_required('owner', 'admin')
def upload_photo(apartment_id):
    """Upload apartment photo"""
    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)
        
        apartment = Apartment.query.get(apartment_id)
        
        if not apartment:
            return jsonify({'message': 'Apartment not found'}), 404
        
        # Check ownership (unless admin)
        if user.role == 'owner' and apartment.owner_id != current_user_id:
            return jsonify({'message': 'You can only upload photos to your own apartments'}), 403
        
        if 'photo' not in request.files:
            return jsonify({'message': 'No photo file provided'}), 400
        
        file = request.files['photo']
        photo_url = save_file(file, 'apartments')
        
        if not photo_url:
            return jsonify({'message': 'Invalid file type'}), 400
        
        # Create photo record
        photo = UnitPhoto(
            apartment_id=apartment_id,
            photo_url=photo_url,
            photo_type=request.form.get('photo_type', 'other'),
            caption=request.form.get('caption'),
            is_cover=request.form.get('is_cover', 'false').lower() == 'true'
        )
        
        db.session.add(photo)
        db.session.commit()
        
        return jsonify({
            'message': 'Photo uploaded successfully',
            'photo': photo.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@apartments_bp.route('/<int:apartment_id>/favorite', methods=['POST'])
@jwt_required()
def toggle_favorite(apartment_id):
    """Add/remove apartment from favorites"""
    try:
        current_user_id = int(get_jwt_identity())
        
        apartment = Apartment.query.get(apartment_id)
        
        if not apartment:
            return jsonify({'message': 'Apartment not found'}), 404
        
        # Check if already favorited
        favorite = Favorite.query.filter_by(
            user_id=current_user_id,
            apartment_id=apartment_id
        ).first()
        
        if favorite:
            # Remove from favorites
            db.session.delete(favorite)
            db.session.commit()
            return jsonify({
                'message': 'Removed from favorites',
                'is_favorite': False
            }), 200
        else:
            # Add to favorites
            favorite = Favorite(
                user_id=current_user_id,
                apartment_id=apartment_id
            )
            db.session.add(favorite)
            db.session.commit()
            return jsonify({
                'message': 'Added to favorites',
                'is_favorite': True
            }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@apartments_bp.route('/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    """Get user's favorite apartments"""
    try:
        current_user_id = int(get_jwt_identity())
        
        favorites = Favorite.query.filter_by(user_id=current_user_id).all()
        
        apartments = []
        for fav in favorites:
            apt_data = fav.apartment.to_dict(include_relations=True)
            apt_data['favorited_at'] = fav.created_at.isoformat()
            apartments.append(apt_data)
        
        return jsonify({
            'favorites': apartments
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500