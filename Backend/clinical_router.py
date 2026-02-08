from fastapi import APIRouter, HTTPException
from extra import ReflectionEntry, Reminder
from database import logs_collection, db
from bson import ObjectId
from typing import List

router = APIRouter(prefix="/api/v1", tags=["clinical"])

reminders_collection = db.get_collection("reminders")

# --- Reflection Logs Helpers ---
def log_helper(log) -> dict:
    return {
        "id": str(log["_id"]),
        "patient_id": log["patient_id"],
        "date": log["date"],
        "time": log["time"],
        "text": log["text"],
        "status": log["status"],
        "type": log["type"],
        "response": log.get("response")
    }

# --- Reminder Helpers ---
def reminder_helper(rem) -> dict:
    return {
        "id": str(rem["_id"]),
        "patient_id": rem.get("patient_id"),
        "patient_name": rem["patient_name"],
        "type": rem["type"],
        "text": rem["text"],
        "priority": rem["priority"],
        "time_label": rem["time_label"],
        "status": rem["status"]
    }

# --- Reflection Endpoints ---

@router.post("/logs", response_model=ReflectionEntry)
async def create_log(log: ReflectionEntry):
    log_dict = log.model_dump(exclude={"id"})
    result = await logs_collection.insert_one(log_dict)
    new_log = await logs_collection.find_one({"_id": result.inserted_id})
    return log_helper(new_log)

@router.get("/logs/{patient_id}", response_model=List[ReflectionEntry])
async def get_patient_logs(patient_id: str):
    logs = []
    async for log in logs_collection.find({"patient_id": patient_id}):
        logs.append(log_helper(log))
    return logs

@router.put("/logs/{log_id}")
async def update_log(log_id: str, update_data: dict):
    await logs_collection.update_one(
        {"_id": ObjectId(log_id)},
        {"$set": update_data}
    )
    return {"message": "Log updated"}

# --- Reminder Endpoints ---

@router.post("/reminders", response_model=Reminder)
async def create_reminder(rem: Reminder):
    rem_dict = rem.model_dump(exclude={"id"})
    result = await reminders_collection.insert_one(rem_dict)
    new_rem = await reminders_collection.find_one({"_id": result.inserted_id})
    return reminder_helper(new_rem)

@router.get("/reminders", response_model=List[Reminder])
async def list_reminders():
    rems = []
    async for rem in reminders_collection.find({"status": "pending"}):
        rems.append(reminder_helper(rem))
    return rems

@router.delete("/reminders/{rem_id}")
async def dismiss_reminder(rem_id: str):
    await reminders_collection.update_one(
        {"_id": ObjectId(rem_id)},
        {"$set": {"status": "dismissed"}}
    )
    return {"message": "Reminder dismissed"}
