
from pydantic import BaseModel
class User(BaseModel):
    username: str
    password:str
    phone: str
    createAt:str
    role:str
    department:str
