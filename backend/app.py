from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
from os import environ

def create_app():
    app = Flask(__name__)
    CORS(app)

    database_url = environ.get('DATABASE_URL')
    if database_url and database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)

    if not database_url:
        raise ValueError("No DATABASE_URL environment variable set")

    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    return app

app = create_app()
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
    start_time = db.Column(db.DateTime, nullable = False)
    end_time = db.Column(db.DateTime, nullable = False)
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

def init_db():
    with app.app_context():
        db.create_all()

init_db()

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
        user = User.query.filter_by(id=id).first()
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

# create an event
@app.route('/api/events', methods = ['POST'])
def create_event():
    try:
        data = request.get_json()
        start_time = datetime.fromisoformat(data['start_time'])  # ISO 8601 format (e.g., "2025-01-18T15:30:00")
        end_time = datetime.fromisoformat(data['end_time'])      # ISO 8601 format (e.g., "2025-01-18T17:00:00")
        new_event = Event(
            title=data['title'],
            start_time=start_time,
            end_time=end_time,
            location=data['location'],
            details=data.get('details', None),
            creator_id=data['creator_id']
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

# add an attendee to an existing event
@app.route('/api/events/<event_id>/attendees/<user_id>', methods = ['POST'])
def add_attendee(event_id, user_id):
    try:
        with app.app_context():
            event = Event.query.get(event_id)
            user = User.query.get(user_id)
            if not event:
                return make_response(jsonify({'message': f'Event with id {event_id} not found'}), 404)
            if not user:
                return make_response(jsonify({'message': f'User with id {user_id} not found'}), 404)
            if user in event.attendees:
                return make_response(jsonify({'message': 'User is already an attendee'}), 400)
            event.attendees.append(user)
            db.session.commit()
            return jsonify({
                'message': 'Attendee added successfully',
                'event': event.json()
            }), 200
    except Exception as e:
        return make_response(
            jsonify({
                'message': 'Error adding attendee',
                'error': str(e)
            }), 500)

# update an event by id
@app.route('/api/events/<id>', methods = ['PUT'])
def update_event(id):
    try:
        event = Event.query.filter_by(id=id).first()
        if not event:
            return make_response(jsonify({'message': 'Event not found'}), 404)
        data = request.get_json()
        event.title = data.get('title', event.title)
        event.start_time = datetime.fromisoformat(data['start_time']) if 'start_time' in data else event.start_time
        event.end_time = datetime.fromisoformat(data['end_time']) if 'end_time' in data else event.end_time
        event.location = data.get('location', event.location)
        event.details = data.get('details', event.details)
        if 'attendee_ids' in data:
            attendees = User.query.filter(User.id.in_(data['attendee_ids'])).all()
            if attendees:
                event.attendees = attendees
        db.session.commit()
        return jsonify({'message': 'Event updated successfully', 'event': event.json()}), 200
    except Exception as e:
        return make_response(
            jsonify({
                'message': 'Error updating event',
                'error': str(e)
            }), 500)

# delete an event by id
@app.route('/api/events/<id>', methods = ['DELETE'])
def delete_event(id):
    try:
        event = Event.query.filter_by(id=id).first()
        if event:
            db.session.delete(event)
            db.session.commit()
            return make_response(jsonify({'message': 'event deleted'}), 200)
        return make_response(jsonify({'message': 'event not found'}), 404)
    except Exception as e:
        return make_response(
            jsonify({
                'message': 'error deleting events', 
                'error': str(e)
            }), 500)
