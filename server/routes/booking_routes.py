from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.booking import Booking
from models.event import Event

booking_bp = Blueprint('booking', __name__, url_prefix='/api/bookings')


@booking_bp.route('/', methods=['POST'])
@jwt_required()
def create_booking():
    data = request.get_json()
    user_id = get_jwt_identity()
    event_id = data.get('event_id')
    seat_count = data.get('seat_count')

    if not event_id or not seat_count:
        return jsonify({'error': 'Champs manquants'}), 400

    event = Event.query.get(event_id)
    if not event:
        return jsonify({'error': "Événement introuvable"}), 404

    if event.available_seats < seat_count:
        return jsonify({'error': 'Pas assez de places disponibles'}), 400

    # Créer la réservation
    booking = Booking(user_id=user_id, event_id=event_id, seat_count=seat_count)
    db.session.add(booking)
    event.available_seats -= seat_count
    db.session.commit()

    return jsonify({'message': 'Réservation effectuée avec succès'})


@booking_bp.route('/my', methods=['GET'])
@jwt_required()
def get_my_bookings():
    user_id = get_jwt_identity()
    bookings = Booking.query.filter_by(user_id=user_id).all()

    result = []
    for b in bookings:
        result.append({
            'id': b.id,
            'event_title': b.event.title,
            'event_date': b.event.date.isoformat(),
            'seat_count': b.seat_count,
            'booking_date': b.booking_date.isoformat()
        })

    return jsonify(result)


@booking_bp.route('/<int:booking_id>', methods=['DELETE'])
@jwt_required()
def cancel_booking(booking_id):
    user_id = get_jwt_identity()
    booking = Booking.query.get(booking_id)

    if not booking or booking.user_id != int(user_id):
        return jsonify({'error': "Réservation introuvable ou accès non autorisé"}), 404

    # Rendre les places à l'événement
    event = booking.event
    event.available_seats += booking.seat_count

    db.session.delete(booking)
    db.session.commit()

    return jsonify({'message': 'Réservation annulée avec succès'})
