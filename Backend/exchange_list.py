from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from database import db

router = APIRouter(prefix="/api/v1", tags=["exchange-list"])

food_collection = db.get_collection("food_exchange")

class FoodItem(BaseModel):
    id: Optional[str] = None
    name: str
    portion: str
    group: str
    subgroup: Optional[str] = None
    category: str  # carb, protein, fat, mixed
    carbohydrates: float
    protein: float
    fat: float
    calories: int

def food_helper(food) -> dict:
    return {
        "id": str(food["_id"]),
        "name": food["name"],
        "portion": food["portion"],
        "group": food["group"],
        "subgroup": food.get("subgroup"),
        "category": food["category"],
        "carbohydrates": food["carbohydrates"],
        "protein": food["protein"],
        "fat": food["fat"],
        "calories": food["calories"]
    }

@router.on_event("startup")
async def seed_food_data():
    """Seed the database with initial food exchange data if empty"""
    from database import check_db
    if not await check_db():
        print("⚠️ Skipping food seeding: Database not reachable")
        return
        
    try:
        count = await food_collection.count_documents({})
        if count == 0:
            from exchange_list_data import EXCHANGE_LIST_INITIAL
            await food_collection.insert_many(EXCHANGE_LIST_INITIAL)
            print("Database seeded with Food Exchange List")
    except Exception as e:
        print(f"Error seeding data: {e}")


@router.get("/exchange-list")
async def get_exchange_list():
    """Returns the complete food exchange list from the database"""
    foods = []
    async for food in food_collection.find().sort([("group", 1), ("name", 1)]):
        foods.append(food_helper(food))
    
    return {
        "total_items": len(foods),
        "items": foods
    }

@router.get("/exchange-list/groups")
async def get_groups():
    """Returns available food groups"""
    groups = await food_collection.distinct("group")
    return {"groups": sorted(groups)}

@router.get("/exchange-list/category/{category}")
async def get_by_category(category: str):
    """Returns foods filtered by category (carb, protein, fat, mixed)"""
    foods = []
    async for food in food_collection.find({"category": category.lower()}):
        foods.append(food_helper(food))
    
    return {
        "category": category,
        "total_items": len(foods),
        "items": foods
    }
