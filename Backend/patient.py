from pydantic import BaseModel
from typing import List, Optional

class PatientProfile(BaseModel):
    id: Optional[str] = None
    name: str
    age: int
    gender: str
    height: float
    weight: float
    activity_level: str
    allergies: Optional[str] = None
    dietary_restrictions: Optional[str] = None
    medical_notes: Optional[str] = None
    goal: str
    bmi: Optional[float] = None
    bmr: Optional[float] = None
    tdee: Optional[float] = None
