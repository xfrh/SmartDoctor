from pydantic import BaseModel
from typing import Optional
from datetime import datetime
class Conclusion(BaseModel):
    control_distance: Optional[float] =None
    test_1: Optional[float] =None
    test_2: Optional[float] =None
    test_3: Optional[float] =None
    test_4: Optional[float] =None
class Inspection(BaseModel):
    name:str
    sex:str
    age:str
    phone:str
    createAt:str
    updateAt: Optional[str] = None
    testedby: Optional[str] = None
    conclusion: Optional[Conclusion] = None
