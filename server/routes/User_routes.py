from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.user import User

user_bp = Blueprint('user', __name__, url_prefix='/api/users')

@user_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    uid = get_jwt_identity()
    user = User.query.get(uid)
    if not user:
        return jsonify({'error': 'Utilisateur introuvable'}), 404
    return jsonify({
        'id': user.id,
        'email': user.email,
        'name': user.name,
        'is_organizer': user.is_organizer
    })

@user_bp.route('/me', methods=['PUT'])
@jwt_required()
def update_me():
    data = request.get_json() or {}
    uid = get_jwt_identity()
    user = User.query.get(uid)
    if not user:
        return jsonify({'error': 'Utilisateur introuvable'}), 404

    if data.get('name'):
        user.name = data['name']
    if data.get('email'):
        user.email = data['email']
    if data.get('password'):
        user.set_password(data['password'])

    db.session.commit()
    return jsonify({
        'id': user.id,
        'email': user.email,
        'name': user.name,
        'is_organizer': user.is_organizer
    })
