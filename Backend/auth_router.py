from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr
from datetime import datetime
from database import users_collection, user_helper
from auth_utils import get_password_hash, verify_password, create_access_token, decode_access_token
from bson import ObjectId

router = APIRouter(prefix="/auth", tags=["Authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    username: str
    email: str

async def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    email: str = payload.get("sub")
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )
    user = await users_collection.find_one({"email": email})
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user_helper(user)

@router.post("/register", response_model=dict)
async def register(user_data: UserRegister):
    # Check if user exists
    existing_user = await users_collection.find_one({
        "$or": [{"email": user_data.email}, {"username": user_data.username}]
    })
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered"
        )
    
    hashed_password = get_password_hash(user_data.password)
    new_user = {
        "username": user_data.username,
        "email": user_data.email,
        "password": hashed_password,
        "createdAt": datetime.utcnow()
    }
    
    result = await users_collection.insert_one(new_user)
    if result.inserted_id:
        return {"message": "User registered successfully"}
    raise HTTPException(status_code=500, detail="Failed to register user")

@router.post("/login", response_model=Token)
async def login(user_data: UserLogin):
    user = await users_collection.find_one({"email": user_data.email})
    if not user or not verify_password(user_data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user["email"]})
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "username": user["username"],
        "email": user["email"]
    }

@router.get("/me")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user
