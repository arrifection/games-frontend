import certifi
import motor.motor_asyncio
from pydantic import BaseModel, Field
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB Connection String
# Local: "mongodb://localhost:27017"
# Atlas: "mongodb+srv://<username>:<password>@cluster.mongodb.net/test"
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb+srv://nexusnao:2xTLMDSy7600@cluster0.z4lzt6j.mongodb.net/?appName=Cluster0")

ca = certifi.where()
client = motor.motor_asyncio.AsyncIOMotorClient(
    MONGODB_URL, 
    tlsCAFile=ca,
    tls=True,
    serverSelectionTimeoutMS=5000,
    connectTimeoutMS=5000
)


db = client.nutripro_db

async def check_db():
    try:
        await client.admin.command('ping')
        print("✅ MongoDB Atlas Connected Successfully!")
        return True
    except Exception as e:
        print(f"❌ MongoDB Connection Failed: {e}")
        return False


# Collections
patients_collection = db.get_collection("patients")
plans_collection = db.get_collection("diet_plans")
logs_collection = db.get_collection("reflection_logs")
users_collection = db.get_collection("users")
history_collection = db.get_collection("history")

# Helper to format MongoDB _id to string id
def patient_helper(patient) -> dict:
    return {
        "id": str(patient["_id"]),
        "name": patient["name"],
        "age": patient["age"],
        "gender": patient["gender"],
        "height": patient["height"],
        "weight": patient["weight"],
        "activity_level": patient["activity_level"],
        "allergies": patient.get("allergies"),
        "dietary_restrictions": patient.get("dietary_restrictions"),
        "goal": patient["goal"],
        "bmi": patient.get("bmi"),
        "bmr": patient.get("bmr"),
        "tdee": patient.get("tdee"),
        "medical_notes": patient.get("medical_notes")
    }

def user_helper(user) -> dict:
    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "email": user["email"],
        "createdAt": user.get("createdAt")
    }

