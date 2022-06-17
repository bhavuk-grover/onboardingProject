from fastapi import APIRouter
from models.user import Note 
from config.db import db 
from bson import ObjectId
from datetime import datetime

# schema
def noteEntityWithDate(item):
    return {
        "id":str(item["_id"]),
        "title":item["title"],
        "sub_title":item["sub_title"],
        "tag":item["tag"],
        "text_note":item["text_note"],
        "createdAt" :item["createdAt"],
        "updatedAt": item["updatedAt"],
        "taglist": [item["taglist"]],
    }

def notesEntityWithDate(entity, tag):
    res = [noteEntityWithDate(item) for item in entity]
    if tag == "":
        return [res, db.local.user.count_documents({})]
    else :
        return [res, db.local.user.count_documents({"taglist":tag})]


# to seperate API code from index code
my_app = APIRouter() 

# get note by id
@my_app.get('/{id}')
async def get_one_note(id):
    return noteEntityWithDate(db.local.user.find_one({"_id":ObjectId(id)}))

# get and search api
@my_app.get('/')
async def find_tag(tag:str = "", page_size: int = 6, page_num : int = 1):
    skips = page_size * (page_num - 1)
    if tag == "":
        return notesEntityWithDate(db.local.user.find().sort("updatedAt",-1).skip(skips).limit(page_size), tag)
    else:
        return notesEntityWithDate(db.local.user.find({"taglist":tag}).sort("updatedAt",-1).skip(skips).limit(page_size), tag)

@my_app.post('/')
async def create_note(user: Note):    
    temp = dict(user)
    temp["createdAt"]= datetime.utcnow()
    temp["updatedAt"]= datetime.utcnow()
    temp["taglist"] = user.tag.split()
    temp["tag"] ="#" + "#".join(user.tag.split())
    _id= db.local.user.insert_one(temp).inserted_id
    return noteEntityWithDate(db.local.user.find_one({"_id":ObjectId(_id)}))

# for updating note
@my_app.put('/{id}')
async def update_note(id,user: Note):
    
    temp = dict(user)
    temp["updatedAt"] = datetime.utcnow()
    if user.tag[0]=="#":
        temp["tag"] = "#".join(user.tag.split(" "))
    else:
        temp["tag"] = "#"+"#".join(user.tag.split(" "))
    temp["taglist"] = temp["tag"][1:].split("#")
    db.local.user.find_one_and_update({"_id":ObjectId(id)},{
        "$set":temp
    })
    return noteEntityWithDate(db.local.user.find_one({"_id":ObjectId(id)}))

# for deleting note
@my_app.delete('/{id}')
async def delete_note(id):
    return noteEntityWithDate(db.local.user.find_one_and_delete({"_id":ObjectId(id)}))