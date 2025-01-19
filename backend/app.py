from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dateutil.parser import parse
from os import environ

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('DATABASE_URL')
db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(80), unique = True, nullable = False)
    email = db.Column(db.String(120), unique = True, nullable = False)

    def json(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email
        }

attendees = db.Table(
    'attendees',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key = True),
    db.Column('event_id', db.Integer, db.ForeignKey('events.id'), primary_key = True)
)

class Event(db.Model):
    __tablename__ = "events"
    id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String(200), nullable = False)
    start_time = db.Column(db.String(100), nullable = False)
    end_time = db.Column(db.String(100), nullable = False)
    location = db.Column(db.String(200), nullable = False)
    details = db.Column(db.Text, nullable = True)
    creator_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable = False)
    creator = db.relationship("User", backref = "created_events")
    attendees = db.relationship(
        "User",
        secondary = attendees,
        backref = db.backref("attending_events", lazy = "dynamic"),
        lazy = "dynamic"
    )

    def json(self):
        return {
            'id': self.id,
            'title': self.title,
            'start_time': self.start_time,
            'end_time': self.end_time,
            'location': self.location,
            'details': self.details,
            'creator_id': self.creator_id,
            'attendees': [user.json() for user in self.attendees]
        }

db.create_all()

# test route
@app.route('/test', methods = ['GET'])
def test():
    return jsonify({'message': 'the server is running'})

# create a user
@app.route('/api/users', methods = ['POST'])
def create_user():
    try:
        data = request.get_json()
        new_user = User(name = data['name'], email = data['email'])
        db.session.add(new_user)
        db.session.commit()
        return jsonify({
            'id': new_user.id,
            'name': new_user.name,
            'email': new_user.email
        }), 201
    except Exception as e:
        return make_response(
            jsonify({
                'message': 'error creating user',
                'error': str(e)
            }), 500)

# get all users
@app.route('/api/users', methods = ['GET'])
def get_users():
    try:
        users = User.query.all()
        users_data = [{'id': user.id, 'name': user.name, 'email': user.email} for user in users]
        return jsonify(users_data), 200
    except Exception as e:
        return make_response(
            jsonify({
                'message': 'error getting users',
                'error': str(e)
            }), 500)

# get a user by id
@app.route('/api/users/<id>', methods = ['GET'])
def get_user(id):
    try:
        user = User.queryfilter_by(id=id).first()
        if user:
            return make_response(jsonify({'user': user.json()}), 200)
        return make_response(jsonify({'message': 'user not found'}), 404)
    except Exception as e:
        return make_response(
            jsonify({
                'message': 'error getting user',
                'error': str(e)
            }), 500)

# update a user by id
@app.route('/api/users/<id>', methods = ['PUT'])
def update_user(id):
    try:
        user = User.query.filter_by(id=id).first()
        if user:
            data = request.get_json()
            user.name = data['name']
            user.email = data['email']
            db.session.commit()
            return make_response(jsonify({'message': 'user updated'}), 200)
        return make_response(jsonify({'message': 'user not found'}), 404)
    except Exception as e:
        return make_response(
            jsonify({
                'message': 'error updating user', 
                'error': str(e)
            }), 500)

# delete a user by id
@app.route('/api/users/<id>', methods = ['DELETE'])
def delete_user(id):
    try:
        user = User.query.filter_by(id=id).first()
        if user:
            db.session.delete(user)
            db.session.commit()
            return make_response(jsonify({'message': 'user deleted'}), 200)
        return make_response(jsonify({'message': 'user not found'}), 404)
    except Exception as e:
        return make_response(
            jsonify({
                'message': 'error deleting user', 
                'error': str(e)
            }), 500)

@app.route('/api/events', methods=['POST'])
def create_event():
    try:
        data = request.get_json()
        start_time = parse(data['start_time'])  # ISO 8601 format (e.g., "2025-01-18T15:30:00")
        end_time = parse(data['end_time'])      # ISO 8601 format (e.g., "2025-01-18T17:00:00")
        new_event = Event(
            title = data['title'],
            start_time = start_time,
            end_time = end_time,
            location = data['location'],
            details = data.get('details', None),
            creator_id = data['creator_id']
        )
        if 'attendee_ids' in data:
            attendees = User.query.filter(User.id.in_(data['attendee_ids'])).all()
            if attendees:
                new_event.attendees.extend(attendees)
        db.session.add(new_event)
        db.session.commit()
        return jsonify(new_event.json()), 201
    except Exception as e:
        return make_response(
            jsonify({
                'message': 'Error creating event', 
                'error': str(e)
            }), 500)


