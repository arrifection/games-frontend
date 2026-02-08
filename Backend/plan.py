from pydantic import BaseModel
from typing import List, Dict, Optional

class MealItem(BaseModel):
    id: float 
    name: str
    portion: str
    carbohydrates: float
    protein: float
    fat: float
    calories: int

class DayPlan(BaseModel):
    breakfast: List[MealItem] = []
    snack: List[MealItem] = []
    lunch: List[MealItem] = []
    dinner: List[MealItem] = []

class WeeklyPlan(BaseModel):
    patient_id: Optional[str] = None
    # Map "Monday" -> DayPlan, etc.
    days: Dict[str, DayPlan] = {
        "Monday": DayPlan(), 
        "Tuesday": DayPlan(), 
        "Wednesday": DayPlan(),
        "Thursday": DayPlan(), 
        "Friday": DayPlan(), 
        "Saturday": DayPlan(), 
        "Sunday": DayPlan()
    }
