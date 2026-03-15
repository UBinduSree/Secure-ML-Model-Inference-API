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

class MessageRequest(BaseModel):
    message: str



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
# Load ML model
with open("ml_model/spam_model.pkl", "rb") as f:
    model = pickle.load(f)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def home():
    return {"message": "Secure ML Inference API is running"}

@app.post("/register")
def register(username: str, password: str, db: Session = Depends(get_db)):

    existing_user = db.query(models.User).filter(models.User.username == username).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    user = models.User(username=username, password=hash_password(password))

    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": "User created"}

# LOGIN API
@app.post("/login")
def login(username: str, password: str, db: Session = Depends(get_db)):

    user = db.query(models.User).filter(models.User.username == username).first()

    if not user:
        return {"error": "User not found"}

    if not verify_password(password, user.password):
        return {"error": "Incorrect password"}
    access_token = create_access_token(data={"sub": user.username})
    return {
    "access_token": access_token,
    "token_type": "bearer"
    }

# VERIFY TOKEN
def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):

    token = credentials.credentials

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# PREDICT API
@app.post("/predict")
def predict(data: MessageRequest, credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    message = data.message
    if not message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    prediction = model.predict([message])
    probability = model.predict_proba([message])
    confidence = round(max(probability[0]) * 100, 2)

    result = "Spam" if prediction[0] == 1 else "Not Spam"

    log = f"{datetime.datetime.now()} | User:{username} | Message:{message} | Prediction:{result}\n"
    with open("logs/logs.txt", "a") as f:
        f.write(log)

    return {
    "user": username,
    "message": message,
    "prediction": result,
    "confidence": f"{confidence}%"
    }
@app.get("/health")
def health_check():
    return {"status": "API is healthy"}