from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from datetime import datetime
from database import history_collection
from auth_router import get_current_user
from typing import List, Optional

router = APIRouter(prefix="/history", tags=["User History"])

class HistoryEntry(BaseModel):
    activity_type: str # e.g., "BMI Calculation", "Diet Plan", "Macros"
    input_data: dict
    output_result: dict

@router.post("/add")
async def add_history(entry: HistoryEntry, current_user: dict = Depends(get_current_user)):
    new_entry = {
        "user_email": current_user["email"],
        "activity_type": entry.activity_type,
        "input_data": entry.input_data,
        "output_result": entry.output_result,
        "timestamp": datetime.utcnow()
    }
    
    result = await history_collection.insert_one(new_entry)
    if result.inserted_id:
        return {"message": "History saved successfully", "id": str(result.inserted_id)}
    raise HTTPException(status_code=500, detail="Failed to save history")

@router.get("/list", response_model=List[dict])
async def get_history(current_user: dict = Depends(get_current_user)):
    cursor = history_collection.find({"user_email": current_user["email"]}).sort("timestamp", -1)
    history = []
    async for entry in cursor:
        entry["_id"] = str(entry["_id"])
        history.append(entry)
    return history
