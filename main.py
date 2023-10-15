from datetime import timedelta
from http.client import HTTPException
from typing import Annotated
from bson import ObjectId
from fastapi import FastAPI, File, Body, UploadFile, status, HTTPException, Request, Depends, Header
from fastapi.encoders import jsonable_encoder

from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

import auth
from auth import ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token, encyptPassword,decyptPassword,verify_access_token
from jsonEncoder import JSONEncoder

from accepter import Accpeter
from mymiddelware import ConditionalMiddleware
from user import User
from login import Login
from item import Item
from department import Department
from inspection import Inspection
from database import Database
from fastapi.responses import FileResponse
import imagePrcess
import logging
import json
app = FastAPI()
app.add_middleware(ConditionalMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 通配符 "*" 表示允许任意来源
    allow_credentials=True,
    allow_methods=["*"],  # 通配符 "*" 表示允许任意 HTTP 方法
    allow_headers=["*"],  # 通配符 "*" 表示允许任意请求头
)
@app.options("/")
async def options_handler(request: Request):
    return JSONResponse(content={}, headers={
        "access-control-allow-headers": "access_token",  # 允许 access_token 请求头
    })


Database.initialize()


@app.get("/")
async def root():
     return {"message": "Hello World"}


@app.post("/users/")
async def create_user(user: User):
       encyptedPassword= auth.encyptPassword(user.password)
       user_id= Database.insert("user", {"username":user.username,"password":encyptedPassword,"phone":user.phone,"createAt":user.createAt,"role":user.role,"department" : user.department})
       return {"id":str(user_id.inserted_id)}


@app.delete("/users/{id}")
async def delete_user(id:str):
    if 'ids' in id:
        deleters = []
        xs = id.split("ids=")
        xs = xs[1:]
        for x in xs:
            if '&' in x:
                x = x.replace("&", "").strip()
            myquery = {"_id": ObjectId(x)}
            Database.deleteone("user", myquery)
            deleters.append({"id": x})
        return deleters
    else:
        myquery = {"_id": ObjectId(id)}
        Database.deleteone("user", myquery)
        return {"user_id": id}

@app.put("/users/{id}")
async def update_user(id: str, user: User):
    cypedpassword=encyptPassword(user.password)
    newvalue={"$set":{"username":user.username,"password":cypedpassword,"phone":user.phone,"createAt":user.createAt,"role":user.role}}
    query = {"_id": ObjectId(id)}
    Database.update("user",query,newvalue)
    return {"id": id,"username":user.username,"password":user.password,"phone":user.phone,"createAt":user.createAt,"role":user.role}

@app.get("/users/{id}")
async def read_user(id:str):

    myquery = {"_id":  ObjectId(id)}
    user=Database.findone("user",myquery)
    user["password"]=decyptPassword(user["password"])
    if user:
      ret= JSONEncoder().encode(user).replace("_id","id")
      return ret
    else:
     pass

@app.get("/users/")
async def read_users(request:Request,q: str | None = None):
    users = []
    my_data = request.state.user
    if my_data['role'] == 'admin':
        qq = []
    else:
        qq = {"department": my_data['department']}
    if q:
        if my_data['role'] == 'admin':
            qq ={'username':{'$regex': q}}
        else:
            qq = {"department": my_data['department'],'username':{'$regex': q} }
    results = Database.find("user", qq)
    for doc2 in results:
        doc2["password"] = decyptPassword(doc2["password"])
        ret = JSONEncoder().encode(doc2).replace("_id", "id")
        users.append(ret)
    return users


@app.post("/login/")
async def login_user(login:Login):

   myquery = {"username": login.username}
   user= Database.findone("user",myquery)
   if not user:
       raise HTTPException(
           status_code=status.HTTP_401_UNAUTHORIZED,
           detail="Incorrect username or password",
           headers={"WWW-Authenticate": "Bearer"},
        )
   else:
       hashedPassword=auth.decyptPassword(user["password"])
       if hashedPassword !=login.password:
           raise HTTPException(
               status_code=status.HTTP_401_UNAUTHORIZED,
               detail="Incorrect password",
               headers={"WWW-Authenticate": "Bearer"},
           )
       else:
           access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
           access_token = create_access_token(data={"username": user['username'], "id": str(user["_id"]), "department" : user["department"] ,"role": user["role"]}, expires_delta=access_token_expires)
           return {"access_token": access_token, "token_type": "bearer"}

@app.post("/accepters/")
async def create_accepter(accepter: Accpeter):
   accept_id = Database.insert("accepter",{"name":accepter.name,"sex":accepter.sex,"phone":accepter.phone,"age": accepter.age,"department":accepter.department,"createAt":accepter.createAt})
   return {"id": str(accept_id.inserted_id)}

@app.delete("/accepters/{id}")
async def delete_accepter(id:str):
    if 'ids' in id:
        deleters = []
        xs = id.split("ids=")
        xs = xs[1:]
        for x in xs:
            if '&' in x:
                x = x.replace("&", "").strip()
            myquery = {"_id": ObjectId(x)}
            Database.deleteone("accepter", myquery)
            deleters.append({"id": x})
        return deleters
    else:
        myquery = {"_id": ObjectId(id)}
        Database.deleteone("accepter", myquery)
        return {"accept_id": id}

@app.put("/accepters/{id}")
async def update_accepter(id: str, accepter: Accpeter):
    newvalue={"$set":{"name":accepter.name,"sex":accepter.sex,"phone":accepter.phone,"age":accepter.age,"department":accepter.department,"createAt":accepter.createAt}}
    query = {"_id": ObjectId(id)}
    Database.update("accepter",query,newvalue)
    return {"id": id, "name": accepter.name, "sex": accepter.sex, "age": accepter.age,"phone": accepter.phone, "createAt": accepter.createAt,"department" : accepter.department}


@app.get("/accepters/{id}")
async def read_accepter(id:str):
        myquery = {"_id":  ObjectId(id)}
        accepter=Database.findone("accepter",myquery)
        if accepter:
            ret = JSONEncoder().encode(accepter).replace("_id", "id")
            return ret
        else:
            pass

@app.get("/accepters/")
async def read_accepters(request:Request,q: str | None = None):
    accepters = []
    my_data = request.state.user
    if my_data['role'] == 'admin':
        qq=[]
    else:
        qq ={"department" : my_data['department']}

    if q:
        if my_data['role'] == 'admin':
            qq = {'name': {'$regex': q}}
        else:
            qq = {"department": my_data['department'], 'name': {'$regex': q}}

    results = Database.find("accepter", qq)
    for doc2 in results:

       ret = JSONEncoder().encode(doc2).replace("_id", "id")
       accepters.append(ret)
    return accepters



@app.post("/inspections/")
async def create_inspection(inspection: Inspection):
   inspenction_id= Database.insert("inspection",{"name":inspection.name,"sex":inspection.sex,"age": inspection.age,"phone":inspection.phone,"createAt":inspection.createAt,"testedby" : inspection.testedby})
   return {"id": str(inspenction_id.inserted_id)}

@app.delete("/inspections/{id}")
async def delete_inspection(id:str):

    if 'ids' in id:
        deleters=[]
        xs = id.split("ids=")
        xs = xs[1:]

        for x in xs:
            if '&' in x:
               x = x.replace("&","").strip()

            myquery = {"_id": ObjectId(x)}

            Database.deleteone("inspection", myquery)
            deleters.append({"id":x})
        return deleters
    else:
        myquery = {"_id": ObjectId(id)}
        print(myquery)
        Database.deleteone("inspection", myquery)
        return {"id": id}

@app.put("/inspections/{id}")
async def update_inspection(id:str, inspection:Inspection):
    if inspection.conclusion:
       newvalue = {"$set": {"name": inspection.name, "sex": inspection.sex, "phone": inspection.phone, "age": inspection.age,
                         "testedby": inspection.testedby, "createAt": inspection.createAt, "updateAt": inspection.updateAt,
                         "couclusion" : { "control_distance" : inspection.conclusion.control_distance, "test_1" : inspection.conclusion.test_1,"test_2" : inspection.conclusion.test_2,
                                          "test_3": inspection.conclusion.test_3,"test_4" : inspection.conclusion.test_4} }}
    else:
        newvalue = {
            "$set": {"name": inspection.name, "sex": inspection.sex, "phone": inspection.phone, "age": inspection.age,
                     "testedby": inspection.testedby, "createAt": inspection.createAt, "updateAt": inspection.updateAt} }
    query = {"_id": ObjectId(id)}
    # print(newvalue)
    inspection_id=Database.update("inspection",query,newvalue)
    return {"id": id, "name": inspection.name, "sex": inspection.sex, "age": inspection.age, "phone": inspection.phone, "createAt": inspection.createAt  }

@app.get("/inspections/{id}")
async def read_inspection(id:str):
        myquery = {"_id":  ObjectId(id)}
        inspection=Database.findone("inspection",myquery)
        if inspection:
            ret = JSONEncoder().encode(inspection).replace("_id", "id")
            return ret
        else:
            pass

@app.get("/inspections/")
async def read_inspections(request:Request,q: str | None = None):
    inspections = []
    my_data = request.state.user
    if my_data['role'] == 'admin':
        qq = []
    else:
        qq = {"testedby": my_data['department']}
    if q:
        if my_data['role'] == 'admin':
            qq = {'name': {'$regex': q}}
        else:
            qq = {"department": my_data['department'], 'name': {'$regex': q}}
    results = Database.find("inspection", qq)
    for doc2 in results:
        ret = JSONEncoder().encode(doc2).replace("_id", "id")
        inspections.append(ret)
    return inspections

@app.get("/inspection/{phone}")
async def read_inspection(phone:str | None=None):
  results= Database.find("inspection",{"phone":phone})
  for x in results:
      print(x)

@app.post("/item/")
async def read_item(item:Item):
     result, status_code=imagePrcess.circle_detection(item.file)
     # response.status_code=status
     if status_code==400:
         return {"error":result,"status_code":"400"}
     if status_code ==200:
         item_id=Database.insert("item",{"file":item.file,"inspection_id" : item.inspection_id})
         query = {"_id": ObjectId(item.inspection_id)}
         inspection_id=Database.update("inspection",query,result)
         if item_id and inspection_id:
          return {"id": str(item_id.inserted_id),"status_code":"200"}
         else:
          return {"error":"数据更新失败", "status-code" : "400"}




@app.delete("/items/{id}")
async def delete_item(id:str):
        myquery = {"_id": ObjectId(id)}
        Database.deleteone("item", myquery)
        return {"item_id": id}

@app.put("/items/{id}")
async def update_item(item:Item):
    newvalue = {"$set": {"name": item.name}}
    query = {"_id": ObjectId(id)}
    Database.update("item", query, newvalue)
    return item




@app.get("/items/{id}")
async def read_item(id:str):
        myquery = {"_id":  ObjectId(id)}
        item=Database.findone("item",myquery)
        if item:
            ret = JSONEncoder().encode(item).replace("_id", "id")
            obj=json.loads(ret)
            return obj['file']

        else:
            pass

@app.get("/detail/{id}")
async def read_detail(id: str):
    myquery = {"inspection_id": id}
    item = Database.findone("item", myquery)
    if item:
        ret = JSONEncoder().encode(item).replace("_id", "id")
        obj = json.loads(ret)
        return obj['file']

    else:
        pass


@app.get("/items/")
async def read_items(q: str | None = None):
     items= []
     if q:
        results=Database.find("item",q)
        return results
     else:
         results=Database.find("item",[])
         for doc2 in results:
             ret = JSONEncoder().encode(doc2).replace("_id", "id")
             items.append(ret)
         return items



@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile):
    return {"filename": file.filename}

@app.get("/departments/")
async def read_departments(request:Request,q: str | None = None):
    departments = []
    my_data = request.state.user
    if my_data['role'] == 'admin':
        qq = []
    else:
        qq = {"name": my_data['department']}
    if q and my_data['role'] == 'admin':
        qq = {'name': {'$regex': q}}
    results = Database.find("department", qq)
    for doc2 in results:
        ret = JSONEncoder().encode(doc2).replace("_id", "id")
        departments.append(ret)

    return departments


@app.get("/departments/{id}")
async def read_department(id:str):
        myquery = {"_id":  ObjectId(id)}
        department=Database.findone("department",myquery)
        if department:
            ret = JSONEncoder().encode(department).replace("_id", "id")
            return ret
        else:
            pass

@app.post("/departments/")
async def create_departments(department: Department):
   department_id= Database.insert("department",{"name":department.name,"createAt": department.createAt})
   return {"id": str(department_id.inserted_id)}

@app.delete("/departments/{id}")
async def delete_departments(id:str):

    if 'ids' in id:
        deleters=[]
        xs = id.split("ids=")
        xs = xs[1:]

        for x in xs:
            if '&' in x:
               x = x.replace("&","").strip()

            myquery = {"_id": ObjectId(x)}

            Database.deleteone("department", myquery)
            deleters.append({"id":x})
        return deleters
    else:
        myquery = {"_id": ObjectId(id)}
        print(myquery)
        Database.deleteone("department", myquery)
        return {"id": id}

@app.put("/departments/{id}")
async def update_departments(id: str, department: Department):
    newvalue={"$set":{"name":department.name,"createAt":department.createAt}}
    query = {"_id": ObjectId(id)}
    Database.update("department",query,newvalue)
    return {"id": id, "name": department.name, "createAt": department.createAt}
