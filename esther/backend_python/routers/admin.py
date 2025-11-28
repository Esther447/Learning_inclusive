# backend_python/routers/admin.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend_python.database import get_db
from backend_python.models import User, Course, Enrollment, Progress
from backend_python.dependencies import require_role

router = APIRouter(prefix="/admin")

@router.get("/stats")
def get_platform_stats(db: Session = Depends(get_db), current_user=Depends(require_role(["administrator"]))):
    total_users = db.query(User).count()
    total_courses = db.query(Course).count()
    total_enrollments = db.query(Enrollment).count()
    total_progress_entries = db.query(Progress).count()

    return {
        "total_users": total_users,
        "total_courses": total_courses,
        "total_enrollments": total_enrollments,
        "total_progress_entries": total_progress_entries
    }
