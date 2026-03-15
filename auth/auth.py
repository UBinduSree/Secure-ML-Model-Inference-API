from jose import jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext

# JWT SETTINGS
SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# PASSWORD HASHING SETTINGS
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# CREATE TOKEN
def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt


# HASH PASSWORD
def hash_password(password: str):
    return pwd_context.hash(password)


# VERIFY PASSWORD
def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)