import os
from flask import Flask, jsonify
from flask_cors import CORS

from extensions import db, jwt
from models.user import User

from routes.auth_routes import auth_bp
from routes.event_routes import event_bp
from routes.booking_routes import booking_bp

# Création de l'application avec chemin d'instance
app = Flask(__name__, instance_relative_config=True)

# Import manquant ajouté pour os
# S'assure que le dossier instance existe pour la base de données
os.makedirs(app.instance_path, exist_ok=True)

# Active CORS
CORS(app)

# Configuration
# Chemin relatif vers le fichier SQLite dans le dossier instance
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(app.instance_path, 'eventhub.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'votre_cle_secrete_super_sécurisée'

# Initialisation des extensions
db.init_app(app)
jwt.init_app(app)

# Enregistrement des blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(event_bp)
app.register_blueprint(booking_bp)

# Création des tables si besoin
with app.app_context():
    db.create_all()

# Route de test
@app.route('/ping')
def ping():
    return jsonify({'message': 'Pong!'})

# Démarrage du serveur
if __name__ == '__main__':
    app.run(debug=True)
