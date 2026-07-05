from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, get_db, Base
from passlib.context import CryptContext
from pydantic import BaseModel
import models
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

# ===== HOME =====
@app.get("/")
def home():
    return {"message": "Hafsa Noor Portfolio API 🚀"}

# ===== SIGNUP =====
@app.post("/signup")
def signup(name: str, email: str, password: str, db: Session = Depends(get_db)):
    # Check if email already exists
    existing_user = db.query(models.User).filter(models.User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered!")
    
    # Hash password
    hashed = hash_password(password)
    user = models.User(name=name, email=email, password=hashed)
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": f"Welcome {name}! Account created!", "user_id": user.id}

# ===== LOGIN =====
@app.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found!")
    if not verify_password(password, user.password):
        raise HTTPException(status_code=400, detail="Wrong password!")
    return {"message": f"Welcome back {user.name}!", "user_id": user.id}

# ===== GET USERS =====
@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return {"users": [{"id": u.id, "name": u.name, "email": u.email} for u in users]}
from pydantic import BaseModel
# Email settings
EMAIL = "hafsan293@gmail.com"  # apni Gmail likho
APP_PASSWORD = "jlca ihtv fmcf dmtd"  # apna 16 digit password likho
class ContactMessage(BaseModel):
    name: str
    email: str
    subject: str
    message: str

@app.post("/contact")
def contact(msg: ContactMessage):
    try:
        # Email banao
        email_msg = MIMEMultipart()
        email_msg['From'] = EMAIL
        email_msg['To'] = EMAIL
        email_msg['Subject'] = f"Portfolio Contact: {msg.subject}"
        
        body = f"""
        Name: {msg.name}
        Email: {msg.email}
        Subject: {msg.subject}
        Message: {msg.message}
        """
        
        email_msg.attach(MIMEText(body, 'plain'))
        
        # Email bhejo
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(EMAIL, APP_PASSWORD)
        server.sendmail(EMAIL, EMAIL, email_msg.as_string())
        server.quit()
        
        return {"message": f"Thanks {msg.name}! Message received!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Email sending failed!")