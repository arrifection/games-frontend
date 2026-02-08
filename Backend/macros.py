from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class MacroInput(BaseModel):
    tdee: float
    carbs_percent: float
    protein_percent: float
    fat_percent: float

@router.post("/macros")
def calculate_macros(data: MacroInput):
    # Validation
    if data.tdee <= 0:
        raise HTTPException(status_code=400, detail="TDEE must be positive")
    if data.carbs_percent < 0 or data.protein_percent < 0 or data.fat_percent < 0:
         raise HTTPException(status_code=400, detail="Standard percentages cannot be negative")
    
    total_percent = data.carbs_percent + data.protein_percent + data.fat_percent
    # Allow small float error margin
    if not (99.9 <= total_percent <= 100.1):
        raise HTTPException(status_code=400, detail=f"Total percentage must equal 100%. Current total: {total_percent}%")

    # Calculate Calories per Macro
    carbs_kcal = data.tdee * (data.carbs_percent / 100)
    protein_kcal = data.tdee * (data.protein_percent / 100)
    fat_kcal = data.tdee * (data.fat_percent / 100)

    # Calculate Grams per Macro
    # Carbs: 4 kcal/g
    # Protein: 4 kcal/g
    # Fat: 9 kcal/g
    
    carbs_grams = carbs_kcal / 4
    protein_grams = protein_kcal / 4
    fat_grams = fat_kcal / 9

    return {
        "calories": {
            "carbs": round(carbs_kcal, 1),
            "protein": round(protein_kcal, 1),
            "fat": round(fat_kcal, 1),
            "total": round(data.tdee, 1)
        },
        "grams": {
            "carbs": round(carbs_grams, 1),
            "protein": round(protein_grams, 1),
            "fat": round(fat_grams, 1)
        },
        "percentages": {
             "carbs": data.carbs_percent,
             "protein": data.protein_percent,
             "fat": data.fat_percent
        }
    }
