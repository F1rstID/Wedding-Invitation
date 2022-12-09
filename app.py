import datetime
import hashlib
import jwt
import string
import random
from flask import Flask, render_template, jsonify, request, session, redirect, url_for
from flask_mail import Mail, Message
from pymongo import MongoClient

client = MongoClient('mongodb+srv://test:sparta@shinjungwan.pvw0aqx.mongodb.net/?retryWrites=true&w=majority')
db = client.users
app = Flask(__name__)
SECRET_KEY = 'Fullstack Mini Project'

mail_settings = {
    "MAIL_SERVER": 'smtp.gmail.com',
    "MAIL_PORT": 465,
    "MAIL_USE_TLS": False,
    "MAIL_USE_SSL": True,
    "MAIL_USERNAME": 'wnddhks7044@gmail.com',
    "MAIL_PASSWORD": 'indnjxzrdlrdsihn'
}
app.config.update(mail_settings)
mail = Mail(app)


@app.route('/')
def home():
    return render_template('register.html')


@app.route('/api/register', methods=['POST'])
def api_register():
    email_receive = request.form['email_give']
    pw_receive = request.form['pw_give']
    name_receive = request.form['name_give']

    hash_pw = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()
    doc = {
        'email': email_receive,
        'pw': hash_pw,
        'name': name_receive
    }
    db.users.insert_one(doc)

    return jsonify({'result': 'success'})


@app.route('/api/mail', methods=['POST'])
def api_mail():
    email_receive = request.form['email_give']
    email = db.users.find_one({'email': email_receive}, {'_id': False})

    if email is not None:
        return jsonify({'result': 'failed', 'msg': '이미 사용중인 email 입니다.'})

    random_code = "".join([random.choice(string.ascii_letters) for _ in range(10)])
    msg_body = f'Code : {random_code}'
    msg = Message(subject="항해99 | 모바일 청첩장 만들기",
                  sender=app.config.get("MAIL_USERNAME"),
                  recipients=[email_receive],
                  body=msg_body)
    mail.send(msg)
    return jsonify({'result': 'success', 'code': random_code})


@app.route('/api/login', methods=['POST'])
def api_login():
    email_receive = request.form['email_give']
    pw_receive = request.form['pw_give']

    hash_pw = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()

    user = db.user.find_one({'email': email_receive}, {'_id': False})

    if user is None:
        return jsonify({'result': 'failed', 'msg': '존재하지 않는 email 입니다.'})

    if hash_pw != user['pw']:
        return jsonify({'result': 'failed', 'msg': '비밀번호가 틀렸습니다.'})

    payload = {
        'email': email_receive,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=3)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

    return jsonify({'result': 'success', 'token': token})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
