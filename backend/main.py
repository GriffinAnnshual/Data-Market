from flask import Flask, request, jsonify, make_response
from passlib.hash import bcrypt
from flask_cors import CORS
from flask import session
import jwt
from passlib.hash import bcrypt
import mysql.connector

app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
app.config['PERMANENT_SESSION_LIFETIME'] = 1800

CORS(app)
def DBConnection():
    connection = mysql.connector.connect(user='root', password='root',
                              host='localhost',
                              database='users')
    return connection

@app.before_request
def before_request():
    if request.endpoint == 'home':
        token = session.get("token")
        if not token:
            return jsonify({'success': False, 'message': 'Missing token'}), 401
        try:
            data = jwt.decode(token, 'secretKey', algorithms=['HS256'])
            print(data)
            session['user'] = data
        except:
            return jsonify({'success': False, 'message': 'Invalid token'}), 401
    
def user_exists(cursor, column, value):
    query = f"SELECT * FROM users WHERE {column} = %s"
    cursor.execute(query, (value,))
    return cursor.fetchone() is not None

@app.route("/register", methods=["POST"])
def register_user():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        username = data.get('username')
        connection = DBConnection()
        cursor = connection.cursor()

        if user_exists(cursor, 'username', username):
            return jsonify({'exists': True, 'message': 'Username Already taken'}), 401
        if user_exists(cursor, 'email', email):
            return jsonify({'exists': True, 'message': 'Email Already taken'}), 401

        hash_password = bcrypt.hash(password)

        query = "INSERT INTO users (username, password, email) VALUES (%s, %s, %s)"
        cursor.execute(query, (username, hash_password, email))
        connection.commit()

        token = jwt.encode(
            {'email': email, 'name': username, 'password': hash_password},
            'secretKey',
            algorithm='HS256'
        )
        session["token"] = token
        response = make_response(jsonify({'success': True, "message": "Registered Successfully!"}), 200)

        return response

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 400



@app.route("/login", methods=["POST"])
def login():
    try:    
        data = request.json
        email = data.get('email')
        password = data.get('password')
        connection = DBConnection()
        cursor = connection.cursor()
        query = "SELECT * FROM users WHERE email = %s"
        cursor.execute(query, (email,))
        user = cursor.fetchone()
        print(user)
        if user is None:
            return jsonify({'success': False, 'message': 'User does not exist'}), 401
        if not bcrypt.verify(password, user[2]):
            return jsonify({'success': False, 'message': 'Invalid password'}), 401
        
        token = jwt.encode(
            {'email': email, 'name': user[1], 'password': user[2]},
            'secretKey',
            algorithm='HS256'
        )
        session["token"] = token
        return jsonify({'success': True, 'message': 'Logged in successfully'}), 200
    except Exception as e:
        return jsonify({'success': False,'message': str(e)}), 401
    

@app.route("/home", methods=['GET'])
def home():
    user = session.get("user")
    return jsonify({"user":user}),200


if __name__ == '__main__':
    app.run()