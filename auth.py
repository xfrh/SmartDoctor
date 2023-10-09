from datetime import datetime, timedelta
from http.client import HTTPException
from cryptography.fernet import Fernet
from jose import JWTError, jwt
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
SECRET_CODE="LV-EvNcjbSmT41gUahMBrD71nv-T2jS6ak_09CdxNTw="
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=60)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
def verify_access_token(token:str):
    return jwt.decode(token, SECRET_KEY, ALGORITHM)

def encyptPassword(password:str):
    cipher_suite = Fernet(SECRET_CODE)
    password = password.encode()
    encrypted_password = cipher_suite.encrypt(password)
    return encrypted_password

def decyptPassword(encrypted_password:str):
    cipher_suite = Fernet(SECRET_CODE)
    decrypted_password = cipher_suite.decrypt(encrypted_password)
    decrypted_password_str = decrypted_password.decode()
    return decrypted_password_str