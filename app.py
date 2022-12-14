import datetime
import hashlib
import json
import jwt
import string
import random
from flask import Flask, render_template, jsonify, request, session, redirect, url_for
from flask_mail import Mail, Message
import base64
import mongo
import storage

db = mongo.client.users
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


# html 페이지 rendering하기 위한 부분
@app.route('/')
def home():
    return render_template('login.html')


@app.route('/register', methods=['GET', 'POST'])
def register_page():
    return render_template('register.html')


@app.route('/edit_view')
def editview():
    return render_template('edit_view.html')


def upload(image_data, email):
    s3 = storage.connection()

    try:
        image_split = image_data.split('base64,')[1]
        image = image_split + '=' * (4 - len(image_split) % 4)
        decoded_data = base64.b64decode(image)
        s3.put_object(Key=email + '/' + '1.jpg',
                      Body=decoded_data,
                      ContentType='image/*',
                      ACL='public-read',
                      Bucket=storage.BUCKET)
    except Exception as e:
        print(e)
    return print('success')


@app.route('/api/save', methods=['POST'])
def api_save():
    data_receive = request.form['data_give']
    data = json.loads(data_receive)
    token = request.cookies.get('mytoken')

    try:
        email = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return  # 리프레쉬 토큰 해주기
    except jwt.exceptions.DecodeError:
        return '넌 누구냐.'

    userdata = db.usersdata.find_one({'email': email['email']})
    doc = data
    doc['email'] = email['email']

    upload(data['image_url'], email['email'])
    doc['image_url'] = 'https://sparata-sjw.s3.ap-northeast-2.amazonaws.com/' + \
                       email['email'] + '/1.jpg'

    if userdata is None:
        db.usersdata.insert_one(doc)
        return doc

    db.usersdata.update_one({'email': email['email']}, {'$set': doc})
    return doc


@app.route('/api/load', methods=['GET'])
def api_load():
    token_receive = request.cookies.get("mytoken")

    try:
        email = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return  # 리프레쉬 토큰 해주기
    except jwt.exceptions.DecodeError:
        return '넌 누구냐.'
    doc = db.usersdata.find_one({'email': email['email']}, {'_id': False})

    if doc is None:
        return '없어요, 아무것도, 진짜로'

    return jsonify(doc)


@app.route('/api/load/<email>', methods=['GET'])
def api_load_get(email):
    doc = db.usersdata.find_one({'email': email}, {'_id': False})

    if doc is None:
        return '없어요, 아무것도, 진짜로'
    main_title = doc['main_title']
    image_url = doc['image_url']
    groom_name = doc['groom_name']
    bride_name = doc['bride_name']
    wedding_date = doc['wedding_date']
    wedding_detail_location = doc['wedding_detail_location']
    invitation_parases = doc['invitation_parases']
    groom_father_name = doc['groom_father_name']
    groom_mother_name = doc['groom_mother_name']
    bride_father_name = doc['bride_father_name']
    bride_mother_name = doc['bride_mother_name']
    wedding_hall_name = doc['wedding_hall_name']
    wedding_hall_address = doc['wedding_hall_address']
    wedding_hall_contact = doc['wedding_hall_contact']
    groom_contact = doc['groom_contact']
    bride_contact = doc['bride_contact']
    email = doc['email']

    return redirect(url_for('preview',
                            main_title=main_title,
                            image_url=image_url,
                            groom_name=groom_name,
                            bride_name=bride_name,
                            wedding_date=wedding_date,
                            wedding_detail_location=wedding_detail_location,
                            invitation_parases=invitation_parases,
                            groom_father_name=groom_father_name,
                            groom_mother_name=groom_mother_name,
                            bride_father_name=bride_father_name,
                            bride_mother_name=bride_mother_name,
                            wedding_hall_name=wedding_hall_name,
                            wedding_hall_address=wedding_hall_address,
                            wedding_hall_contact=wedding_hall_contact,
                            groom_contact=groom_contact,
                            bride_contact=bride_contact,
                            email=email))


@app.route('/edit_view', methods=['GET', 'POST'])
def edit_view_page():
    return render_template('edit_view.html')


@app.route('/api/register', methods=['GET', 'POST'])
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

    #  Email 과 같은 이름으로 S3에 폴더를 생성하기
    s3 = storage.connection()
    try:
        s3.put_object(Bucket=storage.BUCKET, Key=(email_receive + '/'))
    except Exception as e:
        print(e)

    return jsonify({'result': 'success'})


@app.route('/api/mail', methods=['POST'])
def api_mail():
    email_receive = request.form['email_give']
    email = db.users.find_one({'email': email_receive}, {'_id': False})

    if email is not None:
        return jsonify({'result': 'failed', 'msg': '이미 사용중인 이메일입니다.'})

    random_code = "".join([random.choice(string.ascii_letters)
                           for _ in range(10)])
    msg_body = f'Code : {random_code}'
    msg = Message(subject="항해99 | 모바일 청첩장 만들기",
                  sender=app.config.get("MAIL_USERNAME"),
                  recipients=[email_receive],
                  body=msg_body)
    mail.send(msg)
    return jsonify({'result': 'success', 'code': random_code, 'msg': '이메일이 발송되었습니다.'})


@app.route('/api/login', methods=['POST'])
def api_login():
    email_receive = request.form['email_give']
    pw_receive = request.form['pw_give']

    # 회원가입 때와 같은 방법으로 pw를 암호화합니다.
    pw_hash = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()

    # email, 암호화된pw을 가지고 해당 유저를 찾습니다.
    user = db.users.find_one({'email': email_receive, 'pw': pw_hash})

    # 찾으면 JWT 토큰을 만들어 발급합니다.
    if user is not None:
        # JWT 토큰에는, payload와 시크릿키가 필요합니다.
        # 시크릿키가 있어야 토큰을 디코딩(=풀기) 해서 payload 값을 볼 수 있습니다.
        # 아래에선 id와 exp를 담았습니다. 즉, JWT 토큰을 풀면 유저ID 값을 알 수 있습니다.
        # exp에는 만료시간을 넣어줍니다. 만료시간이 지나면, 시크릿키로 토큰을 풀 때 만료되었다고 에러가 납니다.
        payload = {
            'email': email_receive,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=4)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
        # token을 줍니다.
        return jsonify({'result': 'success', 'token': token})
    # 찾지 못하면
    else:
        return jsonify({'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'})


@app.route('/preview')
def preview():
    return render_template('preview.html')


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
