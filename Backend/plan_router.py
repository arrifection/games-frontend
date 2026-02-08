from fastapi import APIRouter, HTTPException
from plan import WeeklyPlan
from database import plans_collection

router = APIRouter(prefix="/api/v1", tags=["plans"])

@router.get("/plans/{patient_id}", response_model=WeeklyPlan)
async def get_plan(patient_id: str):
    """Retrieve the weekly diet plan for a specific patient"""
    plan = await plans_collection.find_one({"patient_id": patient_id})
    if not plan:
        # Return a default empty plan if none exists yet
        return WeeklyPlan(patient_id=patient_id)
    
    # Remove the MongoDB internal _id before returning
    if "_id" in plan:
        del plan["_id"]
    return plan

@router.post("/plans/{patient_id}", response_model=WeeklyPlan)
async def save_plan(patient_id: str, plan: WeeklyPlan):
    """Save or update the weekly diet plan for a patient"""
    plan.patient_id = patient_id
    plan_dict = plan.model_dump()
    
    # Use upsert to create or update the plan
    await plans_collection.update_one(
        {"patient_id": patient_id},
        {"$set": plan_dict},
        upsert=True
    )
    
    return plan
