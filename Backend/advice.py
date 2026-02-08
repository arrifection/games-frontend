from fastapi import APIRouter, HTTPException, Query

router = APIRouter()

ADVICE_DB = {
    "Underweight": "Include protein-rich foods, eat regular meals, stay hydrated.",
    "Normal weight": "Maintain healthy habits and regular exercise.",
    "Overweight": "Increase physical activity, reduce sugary and fried foods, maintain balanced meals.",
    "Obese": "Consult a healthcare professional, follow a balanced diet, increase physical activity gradually."
}

@router.get("/advice")
def get_health_advice(category: str = Query(..., description="BMI Category: 'Underweight', 'Normal weight', 'Overweight', 'Obese'")):
    # Normalize input to match keys (case-insensitive check could be good, but strict for now based on reqs)
    # Let's make it a bit robust by being case-insensitive
    
    advice = None
    for key in ADVICE_DB:
        if key.lower() == category.lower():
            advice = ADVICE_DB[key]
            break
            
    if not advice:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid category. Allowed values: {', '.join(ADVICE_DB.keys())}"
        )
    
    return {"category": category, "advice": advice}
 