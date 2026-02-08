from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class ReflectionEntry(BaseModel):
    id: Optional[str] = None
    patient_id: str
    date: str
    time: str
    text: str
    status: str = "pending"  # pending, resolved
    type: str = "Note"       # Symptom, Question, Note
    response: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Reminder(BaseModel):
    id: Optional[str] = None
    patient_id: Optional[str] = None
    patient_name: str
    type: str  # Missed Data, Plan Expiry, Follow-up, etc.
    text: str
    priority: str  # high, medium, low
    time_label: str # e.g., "6h ago", "Upcoming"
    status: str = "pending" # pending, dismissed, actioned
    created_at: datetime = Field(default_factory=datetime.utcnow)
