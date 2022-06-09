from fastapi import APIRouter
from models.user import Note 
from config.db import db 
from bson import ObjectId
from datetime import datetime, timedelta

# schema
def noteEntityWithDate(item):
    return {
        "id":str(item["_id"]),
        "title":item["title"],
        "sub_title":item["sub_title"],
        "text_note":item["text_note"],
        "createdAt" :item["createdAt"],
        "updatedAt": item["updatedAt"]
    }

def notesEntityWithDate(entity):
    return [noteEntityWithDate(item) for item in entity]

# def noteEntity(item):
#     return {
#         "id":str(item["_id"]),
#         "title":item["title"],
#         "sub_title":item["sub_title"],
#         "text_note":item["text_note"],
#     }

# def notesEntity(entity):
#     return [noteEntity(item) for item in entity]

# to seperate API code from index code
my_app = APIRouter() 

# get decorator and fuction for complete list
# pagination
@my_app.get('/')
async def get_all_notes():
    return notesEntityWithDate(db.local.user.find())

# for single element
# stackoverflow reference for find_one
# db.theColl.find( { _id: ObjectId("4ecbe7f9e8c1c9092c000027") } )
@my_app.get('/{id}')
async def get_one_note(id):
    return noteEntityWithDate(db.local.user.find_one({"_id":ObjectId(id)}))

# for creating note
# provide only posted note in response
# network call
@my_app.post('/')
async def create_note(user: Note):
    temp = dict(user)
    temp["createdAt"]= datetime.utcnow()
    temp["updatedAt"]= datetime.utcnow()
    _id= db.local.user.insert(temp)
    return noteEntityWithDate(db.local.user.find_one({"_id":ObjectId(_id)}))

# for updating note
@my_app.put('/{id}')
async def update_note(id,user: Note):
    temp = dict(user)
    temp["updatedAt"] = datetime.utcnow()
    db.local.user.find_one_and_update({"_id":ObjectId(id)},{
        "$set":temp
    })
    return noteEntityWithDate(db.local.user.find_one({"_id":ObjectId(id)}))

# for deleting note
@my_app.delete('/{id}')
async def delete_note(id,user: Note):
    return noteEntityWithDate(db.local.user.find_one_and_delete({"_id":ObjectId(id)}))