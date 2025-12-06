from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel, EmailStr, constr
from uuid import uuid4

from backend_python.mongodb_db import get_users_collection, user_to_dict, dict_to_user
from backend_python.mongodb_models import UserDocument, UserRole
from backend_python.auth_utils import (
    get_password_hash,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token
)
from backend_python.schemas import UserResponse, TokenOut

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





# ==================== AUTH ROUTES ====================

@router.post("/signup", response_model=UserResponse)
async def signup(payload: SignupIn):
    users_collection = get_users_collection()
    
    # Check if email exists
    existing = await users_collection.find_one({"email": payload.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create user document with UUID
    user_doc = UserDocument(
        email=payload.email,
        name=payload.name,
        role=UserRole.learner,
        password_hash=get_password_hash(payload.password)
    )
    
    # Insert into MongoDB
    user_dict = user_to_dict(user_doc)
    # Remove None values
    user_dict = {k: v for k, v in user_dict.items() if v is not None}
    
    result = await users_collection.insert_one(user_dict)
    
    # Fetch the created user by id field
    created_user = await users_collection.find_one({"id": user_doc.id})
    
    # Convert to UserResponse format
    user_data = dict_to_user(created_user)
    return UserResponse(
        id=user_data.id,
        email=user_data.email,
        name=user_data.name,
        role=user_data.role.value,
        created_at=user_data.created_at
    )


@router.post("/login", response_model=TokenOut)
async def login(payload: LoginIn):
    try:
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

        return {
            "access_token": access,
            "refresh_token": refresh,
            "token_type": "bearer",
            "user": {
                "id": str(user.id),
                "email": user.email,
                "name": user.name,
                "role": user.role.value if hasattr(user.role, 'value') else user.role,
                "created_at": user.created_at.isoformat() if user.created_at else None
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print(f"Login error: {e}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/refresh", response_model=TokenOut)
async def refresh_token(payload: RefreshIn = Body(...)):
    decoded = decode_token(payload.refresh_token, refresh=True)

    if not decoded or decoded.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    sub = decoded.get("sub")
    users_collection = get_users_collection()
    # Query by the string ID stored in MongoDB
    user_doc = await users_collection.find_one({"id": sub})

    if not user_doc:
        raise HTTPException(status_code=401, detail="User not found")

    user = dict_to_user(user_doc)
    access = create_access_token(str(user.id))
    refresh = create_refresh_token(str(user.id))

    return TokenOut(
        access_token=access,
        refresh_token=refresh,
        user=UserResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            role=user.role.value,
            created_at=user.created_at
        )
    )
