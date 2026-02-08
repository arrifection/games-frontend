from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class BMRInput(BaseModel):
    weight: float  # weight in kg
    height: float  # height in cm
    age: int
    gender: str    # 'male' or 'female'
    activity_level: Optional[str] = "sedentary"
    goal: Optional[str] = "maintenance"  # weight loss, maintenance, weight gain

@router.post("/bmr")
def calculate_bmr(data: BMRInput):
    # Validation
    if data.weight <= 0:
        raise HTTPException(status_code=400, detail="Weight must be positive")
    if data.height <= 0:
        raise HTTPException(status_code=400, detail="Height must be positive")
    if data.age <= 0:
        raise HTTPException(status_code=400, detail="Age must be positive")
    
    gender = data.gender.lower().strip()
    if gender not in ["male", "female"]:
        raise HTTPException(status_code=400, detail="Gender must be 'male' or 'female'")

    # Mifflin-St Jeor Equation
    if gender == "male":
        bmr = (10 * data.weight) + (6.25 * data.height) - (5 * data.age) + 5
    else:
        bmr = (10 * data.weight) + (6.25 * data.height) - (5 * data.age) - 161

    # TDEE Calculation
    activity_multipliers = {
        "sedentary": 1.2,
        "lightly active": 1.375,
        "moderately active": 1.55,
        "very active": 1.725
    }
    
    activity = data.activity_level.lower().strip() if data.activity_level else "sedentary"
    multiplier = activity_multipliers.get(activity, 1.2)
    tdee = bmr * multiplier

    # Goal Calculation
    goal = data.goal.lower().strip() if data.goal else "maintenance"
    goal_adjustment = 0
    
    if "loss" in goal:
        goal_adjustment = -300
    elif "gain" in goal:
        goal_adjustment = 300
    
    goal_calories = tdee + goal_adjustment

    return {
        "bmr": round(bmr, 2),
        "tdee": round(tdee, 2),
        "goal_calories": round(goal_calories, 2),
        "activity_level": activity,
        "activity_multiplier": multiplier,
        "goal": goal,
        "gender": gender,
        "age": data.age,
        "weight": data.weight,
        "height": data.height,
        "equation": "Mifflin-St Jeor"
    }
