from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from extensions import db
from models.user import User

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    # Validation basique
    for f in ('email', 'password', 'name'):
        if not data.get(f):
            return jsonify({'error': f'Champ "{f}" manquant'}), 400

    # Email unique
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email déjà utilisé'}), 400

    # Récupérer le flag is_organizer (False par défaut)
    is_org = bool(data.get('is_organizer', False))

    # Créer l’utilisateur
    user = User(
        email=data['email'],
        name=data['name'],
        is_organizer=is_org
    )
    user.set_password(data['password'])

    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'Utilisateur enregistré avec succès'}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Champs manquants'}), 400

    user = User.query.filter_by(email=data['email']).first()
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Email ou mot de passe invalide'}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        'access_token': access_token,
        'user': {
            'id': user.id,
            'email': user.email,
            'name': user.name,
            'is_organizer': user.is_organizer
        }
    })


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'Utilisateur introuvable'}), 404

    return jsonify({
        'id': user.id,
        'email': user.email,
        'name': user.name,
        'is_organizer': user.is_organizer
    })
