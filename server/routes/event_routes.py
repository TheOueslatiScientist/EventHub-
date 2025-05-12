from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.event import Event
from models.user import User
from models.booking import Booking
from extensions import db

event_bp = Blueprint('event', __name__, url_prefix='/api/events')

@event_bp.route('/', methods=['GET'])
def get_all_events():
    events = Event.query.all()
    result = []
    for e in events:
        result.append({
            'id': e.id,
            'title': e.title,
            'description': e.description,
            'date': e.date.isoformat(),
            'location': e.location,
            'max_seats': e.max_seats,
            'available_seats': e.available_seats,
            'organizer_id': e.organizer_id
        })
    return jsonify(result)

@event_bp.route('/<int:event_id>', methods=['GET'])
def get_event_by_id(event_id):
    e = Event.query.get(event_id)
    if not e:
        return jsonify({'error': 'Événement non trouvé'}), 404
    return jsonify({
        'id': e.id,
        'title': e.title,
        'description': e.description,
        'date': e.date.isoformat(),
        'location': e.location,
        'max_seats': e.max_seats,
        'available_seats': e.available_seats,
        'organizer_id': e.organizer_id
    })

@event_bp.route('/', methods=['POST'])
@jwt_required()
def create_event():
    user_id = get_jwt_identity()
    u = User.query.get(user_id)
    if not u or not u.is_organizer:
        return jsonify({'error': 'Accès refusé'}), 403

    data = request.get_json() or {}
    for f in ('title', 'date', 'location', 'max_seats'):
        if not data.get(f):
            return jsonify({'error': f'Le champ {f} est manquant'}), 400

    try:
        date_obj = datetime.fromisoformat(data['date'])
    except ValueError:
        return jsonify({'error': 'Format de date invalide'}), 400

    evt = Event(
        title=data['title'],
        description=data.get('description', ''),
        date=date_obj,
        location=data['location'],
        max_seats=int(data['max_seats']),
        available_seats=int(data['max_seats']),
        organizer_id=user_id
    )
    db.session.add(evt)
    db.session.commit()
    return jsonify({'message': 'Événement créé', 'id': evt.id}), 201

@event_bp.route('/<int:event_id>', methods=['PUT'])
@jwt_required()
def update_event(event_id):
    user_id = get_jwt_identity()
    evt = Event.query.get(event_id)
    if not evt:
        return jsonify({'error': 'Événement non trouvé'}), 404
    if evt.organizer_id != user_id:
        return jsonify({'error': 'Accès refusé'}), 403

    data = request.get_json() or {}
    if 'title' in data:
        evt.title = data['title']
    if 'description' in data:
        evt.description = data['description']
    if 'date' in data:
        try:
            evt.date = datetime.fromisoformat(data['date'])
        except ValueError:
            return jsonify({'error': 'Format de date invalide'}), 400
    if 'location' in data:
        evt.location = data['location']
    if 'max_seats' in data:
        new_max = int(data['max_seats'])
        diff = new_max - evt.max_seats
        evt.max_seats = new_max
        evt.available_seats += diff

    db.session.commit()
    return jsonify({'message': 'Événement mis à jour'}), 200

@event_bp.route('/<int:event_id>', methods=['DELETE'])
@jwt_required()
def delete_event(event_id):
    user_id = get_jwt_identity()
    evt = Event.query.get(event_id)
    if not evt:
        return jsonify({'error': 'Événement non trouvé'}), 404
    if evt.organizer_id != user_id:
        return jsonify({'error': 'Accès refusé'}), 403

    Booking.query.filter_by(event_id=event_id).delete(synchronize_session=False)
    db.session.delete(evt)
    db.session.commit()
    return jsonify({'message': 'Événement et réservations supprimés'}), 200
