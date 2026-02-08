from fastapi import APIRouter, HTTPException
from patient import PatientProfile
from database import patients_collection, patient_helper
from bson import ObjectId

router = APIRouter(prefix="/api/v1", tags=["patients"])


def calculate_metrics(profile_dict: dict) -> dict:
    """Calculate BMI, BMR, and TDEE for a patient profile"""
    # BMI Calculation
    height_m = profile_dict["height"] / 100
    profile_dict["bmi"] = round(profile_dict["weight"] / (height_m ** 2), 2)
    
    # BMR Calculation (Mifflin-St Jeor)
    if profile_dict["gender"].lower() == "male":
        profile_dict["bmr"] = round((10 * profile_dict["weight"]) + (6.25 * profile_dict["height"]) - (5 * profile_dict["age"]) + 5)
    else:
        profile_dict["bmr"] = round((10 * profile_dict["weight"]) + (6.25 * profile_dict["height"]) - (5 * profile_dict["age"]) - 161)
        
    # Activity Multiplier mapping
    multipliers = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "active": 1.725,
        "very_active": 1.9
    }
    multiplier = multipliers.get(profile_dict["activity_level"].lower(), 1.2)
    
    # TDEE Calculation
    tdee = profile_dict["bmr"] * multiplier
    
    # Goal Adjustment
    if profile_dict["goal"].lower() == "weight loss":
        tdee -= 300  # deficit
    elif profile_dict["goal"].lower() == "weight gain":
        tdee += 300  # surplus
        
    profile_dict["tdee"] = round(tdee)
    return profile_dict


@router.post("/patients", response_model=PatientProfile)
async def create_patient(profile: PatientProfile):
    """Create a new patient in the database"""
    print(f"📥 Received new patient request: {profile.name}")
    profile_dict = profile.model_dump(exclude={"id"})
    profile_dict = calculate_metrics(profile_dict)

    
    result = await patients_collection.insert_one(profile_dict)
    new_patient = await patients_collection.find_one({"_id": result.inserted_id})
    
    return patient_helper(new_patient)


@router.get("/patients/{patient_id}", response_model=PatientProfile)
async def get_patient(patient_id: str):
    """Get a patient by ID"""
    try:
        patient = await patients_collection.find_one({"_id": ObjectId(patient_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid patient ID format")
    
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    return patient_helper(patient)


@router.put("/patients/{patient_id}", response_model=PatientProfile)
async def update_patient(patient_id: str, updated_profile: PatientProfile):
    """Update an existing patient"""
    try:
        existing = await patients_collection.find_one({"_id": ObjectId(patient_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid patient ID format")
    
    if existing is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    profile_dict = updated_profile.model_dump(exclude={"id"})
    profile_dict = calculate_metrics(profile_dict)
    
    await patients_collection.update_one(
        {"_id": ObjectId(patient_id)},
        {"$set": profile_dict}
    )
    
    updated = await patients_collection.find_one({"_id": ObjectId(patient_id)})
    return patient_helper(updated)


@router.delete("/patients/{patient_id}")
async def delete_patient(patient_id: str):
    """Delete a patient by ID"""
    try:
        result = await patients_collection.delete_one({"_id": ObjectId(patient_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid patient ID format")
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    return {"message": "Patient deleted successfully", "id": patient_id}


@router.get("/patients", response_model=list[PatientProfile])
async def list_patients():
    """Get all patients from the database"""
    patients = []
    async for patient in patients_collection.find():
        patients.append(patient_helper(patient))
    return patients
