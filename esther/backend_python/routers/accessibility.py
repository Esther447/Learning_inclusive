# backend_python/routers/accessibility.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend_python.database import get_db
from backend_python.auth_utils import get_current_user
from backend_python.models import AccessibilitySettings, User
from backend_python.schemas import AccessibilitySettingsIn, AccessibilitySettingsOut

router = APIRouter()

@router.get("/", response_model=AccessibilitySettingsOut)
def get_settings(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    s = db.query(AccessibilitySettings).filter(AccessibilitySettings.user_id == str(current_user.id)).first()
    if not s:
        return AccessibilitySettingsOut(user_id=current_user.id, settings={})
    return AccessibilitySettingsOut(user_id=current_user.id, settings=s.settings or {})

@router.put("/", response_model=AccessibilitySettingsOut)
def update_settings(payload: AccessibilitySettingsIn, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    s = db.query(AccessibilitySettings).filter(AccessibilitySettings.user_id == str(current_user.id)).first()
    if not s:
        s = AccessibilitySettings(user_id=str(current_user.id), settings=payload.settings)
        db.add(s)
    else:
        s.settings = payload.settings
    db.commit()
    db.refresh(s)
    return AccessibilitySettingsOut(user_id=current_user.id, settings=s.settings or {})
