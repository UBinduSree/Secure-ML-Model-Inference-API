from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from backend.database import SessionLocal, engine, Base
from backend import models
from auth.auth import create_access_token, SECRET_KEY, ALGORITHM
from auth.auth import hash_password, verify_password
import pickle
import datetime
import os
from jose import jwt, JWTError

# ------------------ MODELS ------------------

class MessageRequest(BaseModel):
    message: str

class RegisterRequest(BaseModel):
    username: str
    password: str
    role: str = "user"

class LoginRequest(BaseModel):
    username: str
    password: str

# ------------------ APP SETUP ------------------

Base.metadata.create_all(bind=engine)

if not os.path.exists("logs"):
    os.makedirs("logs", exist_ok=True)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# ------------------ GLOBAL STATS ------------------

total_messages = 0
spam_count = 0
safe_count = 0

# ------------------ MIDDLEWARE ------------------

@app.middleware("http")
async def log_requests(request: Request, call_next):
    ip = request.client.host
    endpoint = request.url.path
    time = datetime.datetime.now()

    response = await call_next(request)

    log = f"{time} | IP:{ip} | Endpoint:{endpoint}\n"

    with open("logs/logs.txt", "a") as f:
        f.write(log)

    return response

# ------------------ LOAD MODEL ------------------

with open("ml_model/spam_model.pkl", "rb") as f:
    model = pickle.load(f)

# ------------------ DB DEPENDENCY ------------------

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ------------------ ROUTES ------------------

@app.get("/")
def home():
    return {"message": "Secure ML Inference API is running"}

# ✅ REGISTER
@app.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):

    if data.role.lower() not in ["user", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid role")

    existing_user = db.query(models.User).filter(models.User.username == data.username).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    user = models.User(
        username=data.username,
        password=hash_password(data.password),
        role=data.role.lower()
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": "User created"}

# ✅ LOGIN
@app.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):

    user = db.query(models.User).filter(models.User.username == data.username).first()

    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    if not verify_password(data.password, user.password):
        raise HTTPException(status_code=400, detail="Incorrect password")

    access_token = create_access_token(data={
        "sub": user.username,
        "role": user.role
    })

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

# ✅ VERIFY TOKEN (REUSABLE)
def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ✅ PREDICT (SECURE)
@app.post("/predict")
def predict(data: MessageRequest, user=Depends(verify_token)):

    message = data.message.strip()

    if not message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    username = user.get("sub")

    prediction = model.predict([message])
    probability = model.predict_proba([message])
    confidence = round(max(probability[0]) * 100, 2)

    result = "Spam" if prediction[0] == 1 else "Not Spam"

    global total_messages, spam_count, safe_count
    total_messages += 1

    if result == "Spam":
        spam_count += 1
    else:
        safe_count += 1

    log = f"{datetime.datetime.now()} | User:{username} | Message:{message} | Prediction:{result}\n"

    with open("logs/logs.txt", "a") as f:
        f.write(log)

    return {
        "user": username,
        "message": message,
        "prediction": result,
        "confidence": f"{confidence}%"
    }

# ✅ HEALTH CHECK
@app.get("/health")
def health_check():
    return {"status": "API is healthy"}

# ✅ ADMIN STATS
@app.get("/stats")
def get_stats(user=Depends(verify_token)):

    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Access denied")

    spam_rate = 0

    if total_messages > 0:
        spam_rate = round((spam_count / total_messages) * 100, 2)

    return {
        "total_messages": total_messages,
        "spam_detected": spam_count,
        "safe_messages": safe_count,
        "spam_rate": f"{spam_rate}%"
    }