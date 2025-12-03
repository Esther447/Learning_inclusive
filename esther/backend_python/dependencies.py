# backend_python/dependencies.py
from fastapi import Depends, HTTPException, status
from typing import List
from .mongodb_models import UserDocument
from .auth_utils import get_current_user

def require_role(allowed_roles: List[str]):
    async def role_dependency(current_user: UserDocument = Depends(get_current_user)):
        role_value = getattr(current_user.role, "value", str(current_user.role))
        if role_value not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"User role '{role_value}' not allowed"
            )
        return current_user
    return role_dependency
