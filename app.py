from datetime import datetime
from flask import Flask, render_template, request, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
import os
from os.path import join, dirname
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
from flask_login import LoginManager, UserMixin, login_manager, logout_user, current_user, AnonymousUserMixin, login_user
from flask_login.utils import login_required
dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)
app = Flask(__name__)
mail = Mail(app)
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = os.environ['EMAILID']
app.config['MAIL_PASSWORD'] = os.environ['PASSWORD']
# app.config['MAIL_USERNAME']=''
# app.config['MAIL_PASSWORD']=''
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
mail = Mail(app)
s = URLSafeTimedSerializer(os.environ['SALT'])
# s = URLSafeTimedSerializer('khdfgsdhfgdsf')
app.config['SECRET_KEY'] = os.environ['SECRET_KEY']
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:test123@localhost/bugswash'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'


class Anonymous(AnonymousUserMixin):
    def __init__(self):
        self.username = 'Guest'


app.secret_key = os.environ['SECRET_KEY_2']


class UserProfile(db.Model, UserMixin):
    __tablename__ = 'userprofile'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    imgstr = db.Column(db.String(120))
    salary = db.Column(db.Integer, default=0)
    saving = db.Column(db.Integer, default=0)

    def __repr__(self) -> str:
        return f"{self.id} - {self.username}"

    def verify_password(self, pwd):
        return check_password_hash(self.password, pwd)


class Account(db.Model):
    __tablename__ = 'account'
    aid = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Integer, default=0)
    amounttype = db.Column(db.String(120), nullable=False)
    category = db.Column(db.String(120), nullable=False)
    date = db.Column(db.Date, default=datetime.now())
    user_id = db.Column(db.Integer, db.ForeignKey('userprofile.id'))


@login_manager.user_loader
def load_user(user_id):
    return UserProfile.query.get(int(user_id))


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        return 'POST'
    if request.method == 'GET':
        user = "John"
        return render_template('index.html', user=user)


@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        try:
            username = request.form["username"]
            password = request.form["password"]
            email = request.form["email"]
            print(username, password, email)
            check_if_exsisit_email = UserProfile.query.filter_by(
                email=email).first()
            check_if_exsisit_username = UserProfile.query.filter_by(
                name=username).first()
            hashed_Value = generate_password_hash(password)
            check_if_exsisit_password = UserProfile.query.filter_by(
                password=hashed_Value).first()
            if not check_if_exsisit_email and not check_if_exsisit_username and not check_if_exsisit_password:
                token = s.dumps({"Email": email, "Password": hashed_Value,
                                "Username": username}, salt=os.environ['TOKEN_SALT'])
                print(token)
                msg = Message(
                    'Hello', sender=os.environ['EMAIL'], recipients=[email])
                link = url_for('confirm_email', token=token, _external=True)
                msg.body = 'Your Token Is {}'.format(link)
                mail.send(msg)
                flash('Check Mail For Authentication')
                return render_template('index.html', flag=1)
            else:
                flash('User Already Exist')
                return render_template('index.html', flag=1)
        except:
            flash('Use Diffrent Username and Password')
            return render_template('index.html', flag=1)


@app.route('/confirm_email/<token>')
def confirm_email(token):
    try:
        data = s.loads(token, os.environ['TOKEN_SALT'], max_age=60)
        conf = UserProfile(
            name=data["Username"], email=data["Email"], password=data["Password"])
        db.session.add(conf)
        db.session.commit()
    except SignatureExpired:
        return "The Token Is Expired"
    except BadSignature:
        return "The token is invalid"
    return "This email worked"


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        global eml
        global usnl
        usnl = request.form['usnl']
        psdl = request.form['psdl']
        eml = request.form['eml']
        hashed_Value = generate_password_hash(psdl)
        print(hashed_Value)
        try:
            cheking = UserProfile.query.filter_by(
                name=usnl, email=eml).first()
            print(check_password_hash(cheking.password, psdl))
            if not cheking:
                flash('Username and Email Are Incorrect')
                return render_template('index.html', flag=2)
            elif cheking and check_password_hash(cheking.password, psdl):
                login_user(cheking)
                session['visits'] = cheking.id
                print("LOl", cheking.id)
                # resp = make_response()
                # resp.set_cookie('userID', cheking.id)
                # print("--->>>",request.cookies.get('userID'))
                # flash('login In Succesfully')
                user = UserProfile.query.filter_by(
                    id=session.get('visits')).first()
                return render_template('Dashboard.html', user=user)
            else:
                flash('Password Is Incorrect')
                return render_template('index.html', flag=2)
        except Exception as e:
            print(e)
            flash('Username and Password Are Incorrect')
            return render_template('index.html', flag=2)
    return render_template('index.html')


@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Logout Succesfully')
    return render_template('index.html', flag=1)


if __name__ == '__main__':
    app.run(debug=True)
