from flask import Flask, request, jsonify, make_response, redirect, session
from passlib.hash import bcrypt
from flask_cors import CORS
import jwt
import mysql.connector
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import redis

app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
app.config["SESSION_PERMANENT"] = False


CORS(app, supports_credentials=True, origins=['http://localhost:5173'], allow_headers=[
    "Content-Type", "Authorization", "Access-Control-Allow-Credentials"
])

def DBConnection():
    connection = mysql.connector.connect(user='root', password='root',
                              host='localhost',
                              database='users')
    return connection

@app.before_request
def before_request():
    if request.method == 'OPTIONS':
        # Handle preflight request
        response = make_response()
        response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        return response
    
    if request.endpoint == 'getUser':
        try:
            token = request.headers.get("Authorization")
            if not token:
                return jsonify({'success': False, 'message': 'Missing token'}), 401
            if token.startswith('Bearer '):
                token = token.split(' ')[1]
            token = token[1:-1]
            data = jwt.decode(token, 'secretKey', algorithms=['HS256'])
            session['user'] = data
        except Exception as e:
            return jsonify({'success': False, 'message': token}), 401

    
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
        hash_password = bcrypt.hash(password)
        query = "UPDATE users SET password = %s WHERE email = %s"
        cursor.execute(query, (hash_password, email))
        connection.commit()
        token = jwt.encode(
            {'email': email, 'name': username, 'password': hash_password},
            'secretKey',
            algorithm='HS256'
        )

        response = make_response(jsonify({'success': True, "message": "Registered Successfully!", "token": token}), 200)

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
        if user is None:
            return jsonify({'success': False, 'message': 'User does not exist'}), 401
        if not bcrypt.verify(password, user[2]):
            return jsonify({'success': False, 'message': 'Invalid password'}), 401
        
        token = jwt.encode(
            {'email': email, 'name': user[0], 'password': user[2]},
            'secretKey',
            algorithm='HS256'
        )

        return jsonify({'success': True, 'message': 'Logged in successfully' , "token": token}), 200
    except Exception as e:
        return jsonify({'success': False,'message': str(e)}), 401
    


@app.route("/logout", methods=["GET"])
def logout():
    try:
        return jsonify({'success': True, 'message': 'Logged out successfully'}), 200
    except Exception as e:
        return jsonify({'success': False,'message': str(e)}), 401

@app.route("/send-otp", methods=["POST"])
def send():
    try:
        data = request.json
        print(data)
        email = data.get('email')
        username = data.get('name')
        connection = DBConnection()
        cursor = connection.cursor()

        if user_exists(cursor, 'username', username):
            return jsonify({'exists': True, 'message': 'Username Already taken'}), 401
        if user_exists(cursor, 'email', email):
            return jsonify({'exists': True, 'message': 'Email Already taken'}), 401
        session["email"] = email
        sender_email = "noreply.gmarket@gmail.com"
        receiver_email = email

        token = jwt.encode(
            {'email': email},
            'secretKey',
            algorithm='HS256'
        )
        html_content = """
        <html>
        <body>
            <h3>Dear {0},</h3>
            <br></br>
            <p style="text-align:justify; color:black;">Welcome to the UserMarket, where you get to see lot of users!</p>
            <p style="text-align:justify; color:black;">Verify our Email by clicking on the below button:</b></p>
            <a href="http://127.0.0.1:5000/verify/email?verify={1}&email={2}&name={3}">
            <button style="padding:10px;border-radius:10%;background-color:skyblue;white-space:nowrap;color:black;font-weight:bold;">
            <b>Verify now</b>
            </button>
            </a>
        </body>
        </html>
        """.format(username, token, email, username)
                
        html_part = MIMEText(html_content, 'html')
        message = MIMEMultipart()
        message.attach(html_part)

        message['From'] = "noreply.gmarket@gmail.com"
        message['To'] = email
        message['Subject'] = "Please Verify you Email - UserMarket"

        smtp_server = "smtp.gmail.com"
        smtp_port = 587
        smtp_username = "noreply.gmarket@gmail.com"
        smtp_password = "esgx wvli yrxl xkpv"

        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_username, smtp_password)
            server.sendmail(sender_email, receiver_email, message.as_string())

        return jsonify({"success": True, "message": "Email sent successfully!"}), 200

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 401



@app.route("/verify/email", methods=["GET","POST"])
def verify():
    try:
        if request.method == "POST":
            data = request.json
            email = data.get("email")
            connection =  DBConnection()
            cursor = connection.cursor()
            query = "SELECT emailVerified from users WHERE email = %s"
            cursor.execute(query, (email,))
            user = cursor.fetchone()
            if int(user[0]) == 1:
                return jsonify({"success": True, "message": "Email already verified!"}), 200
            else:
                return jsonify({"success": False, "message": "Email not verified - client!"}), 401
        token = request.args.get('verify')
        email = request.args.get('email')
        name = request.args.get('name')
        data = jwt.decode(token, "secretKey", algorithms=['HS256'])
        if data.get("email") == email:
            connection =  DBConnection()
            cursor = connection.cursor()
            query = "INSERT INTO users (username,email,password,emailVerified) VALUES (%s, %s,%s, %s)"
            cursor.execute(query, (name,email,"",1))
            connection.commit()
            return redirect("http://localhost:5173/verify-email")
        else:
            return jsonify({"success": False, "message": "Email not verified!"}), 401
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 401


@app.route("/getUser", methods=['GET','OPTIONS'])
def getUser():
    user = session.get("user")
    return jsonify({"user":user}),200

@app.route("/users", methods=['GET','OPTIONS'])
def users():
    try:
        connection = DBConnection()
        cursor = connection.cursor()
        query = "SELECT username, email FROM users"
        cursor.execute(query)
        users = cursor.fetchall()
        users_list = [{"username": username, "email": email} for username, email in users]

        return jsonify({"users": users_list}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 401




if __name__ == '__main__':
    app.run()