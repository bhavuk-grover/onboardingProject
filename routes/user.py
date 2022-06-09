from fastapi import APIRouter
from models.user import User 
from config.db import db 
from bson import ObjectId

# schema
def noteEntity(item):
    return {
        "id":str(item["_id"]),
        "title":item["title"],
        "sub_title":item["sub_title"],
        "text_note":item["text_note"]
    }

def notesEntity(entity):
    return [noteEntity(item) for item in entity]

# to seperate API code from index code
my_app = APIRouter() 

# get decorator and fuction for complete list
@my_app.get('/')
async def get_all_notes():
    return notesEntity(db.local.user.find())

# for single element
# stackoverflow reference for find_one
# db.theColl.find( { _id: ObjectId("4ecbe7f9e8c1c9092c000027") } )
@my_app.get('/{id}')
async def get_one_note(id):
    return noteEntity(db.local.user.find_one({"_id":ObjectId(id)}))

# for creating note
# provide only posted note in response
@my_app.post('/')
async def create_note(user: User):
    _id= db.local.user.insert_one(dict(user))
    return noteEntity(db.local.user.find_one({"_id":ObjectId(objectToInsert._id)}))

# for updating note
@my_app.put('/{id}')
async def update_note(id,user: User):
    db.local.user.find_one_and_update({"_id":ObjectId(id)},{
        "$set":dict(user)
    })
    return noteEntity(db.local.user.find_one({"_id":ObjectId(id)}))

# for deleting note
@my_app.delete('/{id}')
async def delete_note(id,user: User):
    return noteEntity(db.local.user.find_one_and_delete({"_id":ObjectId(id)}))
    