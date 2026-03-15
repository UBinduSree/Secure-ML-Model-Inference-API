from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import pickle
import datetime
from jose import jwt, JWTError
from auth.auth import create_access_token, SECRET_KEY, ALGORITHM

app = FastAPI()

security = HTTPBearer()

# Load ML model
with open("ml_model/spam_model.pkl", "rb") as f:
    model = pickle.load(f)

# Dummy user database
users_db = {
    "admin": "1234"
}

@app.get("/")
def home():
    return {"message": "Secure ML Inference API is running"}

# LOGIN API
@app.post("/login")
def login(username: str, password: str):

    if username not in users_db or users_db[username] != password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": username})

    return {"access_token": token}

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
def predict(message: str, credentials: HTTPAuthorizationCredentials = Depends(security)):

    token = credentials.credentials

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    prediction = model.predict([message])

    result = "Spam" if prediction[0] == 1 else "Not Spam"

    log = f"{datetime.datetime.now()} | User:{username} | Message:{message} | Prediction:{result}\n"

    with open("logs/logs.txt", "a") as f:
        f.write(log)

    return {
        "user": username,
        "message": message,
        "prediction": result
    }