from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel, EmailStr, constr
from uuid import uuid4, UUID
from datetime import datetime

from backend_python.mongodb_db import get_users_collection
from backend_python.mongodb_models import UserRole
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
    try:
        users_collection = get_users_collection()

        # Check if email exists
        existing = await users_collection.find_one(
            {"email": payload.email},
            {"_id": 1}
        )
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")

        # Create user ID
        user_id = str(uuid4())

        # Hash the password
        password_hash = get_password_hash(payload.password)

        # Prepare the document
        user_dict = {
            "_id": user_id,
            "email": payload.email,
            "name": payload.name,
            "role": UserRole.learner.value,
            "password_hash": password_hash,
            "created_at": datetime.utcnow()
        }

        # Insert user
        await users_collection.insert_one(user_dict)

        # Return response
        return UserResponse(
            id=UUID(user_id),
            email=payload.email,
            name=payload.name,
            role=UserRole.learner.value,
            created_at=user_dict["created_at"]
        )

    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print(f"❌ Signup error: {e}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/login", response_model=TokenOut)
async def login(payload: LoginIn):
    users_collection = get_users_collection()

    normalized_email = payload.email.lower().strip()

    # Fetch user
    user_doc = await users_collection.find_one(
        {"email": normalized_email},
        {"_id": 1, "email": 1, "name": 1, "role": 1, "password_hash": 1, "created_at": 1}
    )

    # Fallback case-insensitive search
    if not user_doc:
        all_users = await users_collection.find({}).to_list(length=1000)
        user_doc = next(
            (u for u in all_users if u.get("email", "").lower().strip() == normalized_email),
            None
        )

    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Verify password
    if not verify_password(payload.password, user_doc.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    user_id = str(user_doc["_id"])
    access = create_access_token(user_id)
    refresh = create_refresh_token(user_id)

    return TokenOut(
        access_token=access,
        refresh_token=refresh,
        user=UserResponse(
            id=UUID(user_id),
            email=user_doc.get("email", ""),
            name=user_doc.get("name"),
            role=user_doc.get("role", UserRole.learner.value),
            created_at=user_doc.get("created_at", datetime.utcnow())
        )
    )


@router.post("/refresh", response_model=TokenOut)
async def refresh_token(payload: RefreshIn = Body(...)):
    decoded = decode_token(payload.refresh_token, refresh=True)

    if not decoded or decoded.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    sub = decoded.get("sub")
    users_collection = get_users_collection()

    user_doc = await users_collection.find_one(
        {"_id": sub},
        {"_id": 1, "email": 1, "name": 1, "role": 1, "created_at": 1}
    )

    if not user_doc:
        raise HTTPException(status_code=401, detail="User not found")

    user_id = str(user_doc["_id"])
    access = create_access_token(user_id)
    refresh = create_refresh_token(user_id)

    return TokenOut(
        access_token=access,
        refresh_token=refresh,
        user=UserResponse(
            id=UUID(user_id),
            email=user_doc.get("email", ""),
            name=user_doc.get("name"),
            role=user_doc.get("role", UserRole.learner.value),
            created_at=user_doc.get("created_at", datetime.utcnow())
        )
    )
