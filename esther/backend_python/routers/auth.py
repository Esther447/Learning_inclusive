from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel, EmailStr, constr
from uuid import uuid4, UUID

from backend_python.mongodb_db import get_users_collection, user_to_dict, dict_to_user
from backend_python.mongodb_models import UserDocument, UserRole
from backend_python.auth_utils import (
    get_password_hash,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token
)
from backend_python.schemas import UserResponse

router = APIRouter()


# ==================== Request Schemas ====================

class SignupIn(BaseModel):
    email: EmailStr
    password: constr(min_length=6) 
    name: str | None = None


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class RefreshIn(BaseModel):
    refresh_token: str


class TokenOut(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse


# ==================== AUTH ROUTES ====================

@router.post("/signup", response_model=UserResponse)
async def signup(payload: SignupIn):
    users_collection = get_users_collection()
    
    # Check if email exists
    existing = await users_collection.find_one({"email": payload.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Generate a UUID for the user
    user_id = str(uuid4())
    
    # Create user document with the UUID as _id
    user_doc = UserDocument(
        id=user_id,
        email=payload.email,
        name=payload.name,
        role=UserRole.learner,
        password_hash=get_password_hash(payload.password)
    )
    
    # Insert into MongoDB with our UUID as _id
    user_dict = user_to_dict(user_doc)
    # Remove None values
    user_dict = {k: v for k, v in user_dict.items() if v is not None}
    
    await users_collection.insert_one(user_dict)
    
    # Fetch the created user
    created_user = await users_collection.find_one({"_id": user_id})
    
    if not created_user:
        raise HTTPException(status_code=500, detail="Failed to create user")
    
    # Convert to UserResponse format
    try:
        user_data = dict_to_user(created_user)
        return UserResponse(
            id=UUID(user_data.id),
            email=user_data.email,
            name=user_data.name,
            role=user_data.role.value,
            created_at=user_data.created_at
        )
    except (ValueError, TypeError) as e:
        raise HTTPException(status_code=500, detail=f"Failed to process user data: {str(e)}")


@router.post("/login", response_model=TokenOut)
async def login(payload: LoginIn):
    users_collection = get_users_collection()
    
    # Find user by email
    user_doc = await users_collection.find_one({"email": payload.email})
    
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user = dict_to_user(user_doc)
    
    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access = create_access_token(str(user.id))
    refresh = create_refresh_token(str(user.id))

    return TokenOut(
        access_token=access,
        refresh_token=refresh,
        user=UserResponse(
            id=UUID(user.id),
            email=user.email,
            name=user.name,
            role=user.role.value,
            created_at=user.created_at
        )
    )


@router.post("/refresh", response_model=TokenOut)
async def refresh_token(payload: RefreshIn = Body(...)):
    decoded = decode_token(payload.refresh_token, refresh=True)

    if not decoded or decoded.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    sub = decoded.get("sub")
    users_collection = get_users_collection()
    user_doc = await users_collection.find_one({"_id": sub})

    if not user_doc:
        raise HTTPException(status_code=401, detail="User not found")

    user = dict_to_user(user_doc)
    access = create_access_token(str(user.id))
    refresh = create_refresh_token(str(user.id))

    return TokenOut(
        access_token=access,
        refresh_token=refresh,
        user=UserResponse(
            id=UUID(user.id),
            email=user.email,
            name=user.name,
            role=user.role.value,
            created_at=user.created_at
        )
    )
