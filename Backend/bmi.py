from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class BMIInput(BaseModel):
    weight: float
    height: Optional[float] = None  # in meters
    feet: Optional[int] = None
    inches: Optional[float] = None  # float to allow 5.5 inches

@router.post("/bmi")
def calculate_bmi(data: BMIInput):
    # Validate weight
    if data.weight <= 0:
        raise HTTPException(status_code=400, detail="Weight must be positive")

    # Determine height in meters
    height_in_meters = 0.0
    
    if data.height is not None:
        height_in_meters = data.height
    elif data.feet is not None:
        # Convert feet+inches to meters
        # 1 ft = 0.3048 m
        # 1 in = 0.0254 m
        safe_inches = data.inches if data.inches is not None else 0
        height_in_meters = (data.feet * 0.3048) + (safe_inches * 0.0254)
    else:
        raise HTTPException(status_code=400, detail="Provide height in meters OR feet/inches")

    if height_in_meters <= 0:
        raise HTTPException(status_code=400, detail="Invalid height. Must be positive.")
    
    bmi = data.weight / (height_in_meters ** 2)
    
    if bmi < 18.5:
        category = "Underweight"
    elif bmi < 25.0:
        category = "Normal weight"
    elif bmi < 30.0:
        category = "Overweight"
    else:
        category = "Obese"
        
    return {
        "bmi": round(bmi, 2), 
        "category": category,
        "height_used_m": round(height_in_meters, 2)
    }
