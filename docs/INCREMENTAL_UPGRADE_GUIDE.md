# Incremental Upgrade Guide - Extend Existing Platform

## 🎯 Goal
Add LMS features to your **existing platform** without breaking current functionality.

---

## Phase 1: Extend Database (Add New Tables Only)

### Step 1: Add New Tables to Existing Database

Add these tables to your current `models.py`:

```python
# Add to esther/backend_python/models.py

# ==================== Module Model (NEW) ====================
class Module(Base):
    __tablename__ = "modules"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    course_id = Column(UUIDType, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    order_index = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    course = relationship("Course", back_populates="modules")
    lessons = relationship("Lesson", back_populates="module", cascade="all, delete-orphan")

# ==================== Lesson Model (NEW) ====================
class Lesson(Base):
    __tablename__ = "lessons"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    module_id = Column(UUIDType, ForeignKey("modules.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(500), nullable=False)
    lesson_type = Column(String(50), nullable=False)  # video, article, pdf
    content = Column(Text, nullable=True)
    video_url = Column(String(500), nullable=True)
    order_index = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    module = relationship("Module", back_populates="lessons")

# ==================== Assignment Model (NEW) ====================
class Assignment(Base):
    __tablename__ = "assignments"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    course_id = Column(UUIDType, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    due_date = Column(DateTime, nullable=True)
    points = Column(Integer, default=100)
    created_at = Column(DateTime, default=datetime.utcnow)

# ==================== Announcement Model (NEW) ====================
class Announcement(Base):
    __tablename__ = "announcements"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    course_id = Column(UUIDType, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    author_id = Column(UUIDType, ForeignKey("users.id"), nullable=False)
    title = Column(String(500), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

# ==================== Discussion Model (NEW) ====================
class Discussion(Base):
    __tablename__ = "discussions"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    course_id = Column(UUIDType, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUIDType, ForeignKey("users.id"), nullable=False)
    title = Column(String(500), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
```

### Step 2: Update Existing Course Model

Add these relationships to your existing `Course` model:

```python
# In your existing Course model, add these relationships:
modules = relationship("Module", back_populates="course", cascade="all, delete-orphan")
assignments = relationship("Assignment", back_populates="course", cascade="all, delete-orphan")
announcements = relationship("Announcement", back_populates="course", cascade="all, delete-orphan")
discussions = relationship("Discussion", back_populates="course", cascade="all, delete-orphan")
```

---

## Phase 2: Add New API Endpoints

### Create New Router Files

#### 1. Create `esther/backend_python/routers/modules.py`

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Module
from uuid import UUID

router = APIRouter()

@router.get("/courses/{course_id}/modules")
def get_course_modules(course_id: UUID, db: Session = Depends(get_db)):
    modules = db.query(Module).filter(Module.course_id == course_id).order_by(Module.order_index).all()
    return modules

@router.post("/courses/{course_id}/modules")
def create_module(course_id: UUID, title: str, description: str, order_index: int, db: Session = Depends(get_db)):
    module = Module(course_id=course_id, title=title, description=description, order_index=order_index)
    db.add(module)
    db.commit()
    db.refresh(module)
    return module
```

#### 2. Create `esther/backend_python/routers/lessons.py`

```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Lesson
from uuid import UUID

router = APIRouter()

@router.get("/modules/{module_id}/lessons")
def get_module_lessons(module_id: UUID, db: Session = Depends(get_db)):
    lessons = db.query(Lesson).filter(Lesson.module_id == module_id).order_by(Lesson.order_index).all()
    return lessons

@router.post("/modules/{module_id}/lessons")
def create_lesson(module_id: UUID, title: str, lesson_type: str, content: str, order_index: int, db: Session = Depends(get_db)):
    lesson = Lesson(module_id=module_id, title=title, lesson_type=lesson_type, content=content, order_index=order_index)
    db.add(lesson)
    db.commit()
    db.refresh(lesson)
    return lesson
```

#### 3. Create `esther/backend_python/routers/assignments.py`

```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Assignment
from uuid import UUID

router = APIRouter()

@router.get("/courses/{course_id}/assignments")
def get_course_assignments(course_id: UUID, db: Session = Depends(get_db)):
    assignments = db.query(Assignment).filter(Assignment.course_id == course_id).all()
    return assignments

@router.post("/courses/{course_id}/assignments")
def create_assignment(course_id: UUID, title: str, description: str, points: int, db: Session = Depends(get_db)):
    assignment = Assignment(course_id=course_id, title=title, description=description, points=points)
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment
```

#### 4. Create `esther/backend_python/routers/announcements.py`

```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Announcement
from uuid import UUID

router = APIRouter()

@router.get("/courses/{course_id}/announcements")
def get_course_announcements(course_id: UUID, db: Session = Depends(get_db)):
    announcements = db.query(Announcement).filter(Announcement.course_id == course_id).order_by(Announcement.created_at.desc()).all()
    return announcements

@router.post("/courses/{course_id}/announcements")
def create_announcement(course_id: UUID, author_id: UUID, title: str, content: str, db: Session = Depends(get_db)):
    announcement = Announcement(course_id=course_id, author_id=author_id, title=title, content=content)
    db.add(announcement)
    db.commit()
    db.refresh(announcement)
    return announcement
```

### Step 3: Register New Routers in `main.py`

Add to your existing `main.py`:

```python
# Add these imports
from backend_python.routers import modules, lessons, assignments, announcements

# Add these router registrations (after existing routers)
app.include_router(modules.router, prefix="/api/modules", tags=["Modules"])
app.include_router(lessons.router, prefix="/api/lessons", tags=["Lessons"])
app.include_router(assignments.router, prefix="/api/assignments", tags=["Assignments"])
app.include_router(announcements.router, prefix="/api/announcements", tags=["Announcements"])
```

---

## Phase 3: Extend Frontend

### Step 1: Add New Components

#### 1. Create `Inclusive_learning_frontend/esther/src/components/ModuleList.tsx`

```typescript
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  lessonType: string;
}

export default function ModuleList({ modules }: { modules: Module[] }) {
  return (
    <Box>
      {modules.map((module) => (
        <Accordion key={module.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{module.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{module.description}</Typography>
            {module.lessons?.map((lesson) => (
              <Box key={lesson.id} sx={{ ml: 2, mt: 1 }}>
                <Typography>📄 {lesson.title}</Typography>
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
```

#### 2. Create `Inclusive_learning_frontend/esther/src/components/AssignmentList.tsx`

```typescript
import { Box, Card, CardContent, Typography, Chip } from '@mui/material';

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  points: number;
}

export default function AssignmentList({ assignments }: { assignments: Assignment[] }) {
  return (
    <Box>
      {assignments.map((assignment) => (
        <Card key={assignment.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{assignment.title}</Typography>
            <Typography color="text.secondary">{assignment.description}</Typography>
            <Box sx={{ mt: 1 }}>
              <Chip label={`${assignment.points} points`} size="small" />
              <Chip label={`Due: ${new Date(assignment.dueDate).toLocaleDateString()}`} size="small" sx={{ ml: 1 }} />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
```

#### 3. Create `Inclusive_learning_frontend/esther/src/components/AnnouncementList.tsx`

```typescript
import { Box, Card, CardContent, Typography } from '@mui/material';

interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function AnnouncementList({ announcements }: { announcements: Announcement[] }) {
  return (
    <Box>
      {announcements.map((announcement) => (
        <Card key={announcement.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">📢 {announcement.title}</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>{announcement.content}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {new Date(announcement.createdAt).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
```

### Step 2: Update Existing Course Page

Add tabs to your existing `CoursePage.tsx`:

```typescript
import { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import ModuleList from '../components/ModuleList';
import AssignmentList from '../components/AssignmentList';
import AnnouncementList from '../components/AnnouncementList';

export default function CoursePage() {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Tabs value={tab} onChange={(_, v) => setTab(v)}>
        <Tab label="Modules" />
        <Tab label="Assignments" />
        <Tab label="Announcements" />
      </Tabs>

      {tab === 0 && <ModuleList modules={[]} />}
      {tab === 1 && <AssignmentList assignments={[]} />}
      {tab === 2 && <AnnouncementList announcements={[]} />}
    </Box>
  );
}
```

### Step 3: Add API Service Functions

Add to your existing `services/api.ts`:

```typescript
// Add these functions to your existing api.ts

export const getModules = async (courseId: string) => {
  const response = await fetch(`${API_URL}/api/modules/courses/${courseId}/modules`);
  return response.json();
};

export const getAssignments = async (courseId: string) => {
  const response = await fetch(`${API_URL}/api/assignments/courses/${courseId}/assignments`);
  return response.json();
};

export const getAnnouncements = async (courseId: string) => {
  const response = await fetch(`${API_URL}/api/announcements/courses/${courseId}/announcements`);
  return response.json();
};
```

---

## Quick Implementation Steps

### Backend (30 minutes)
1. ✅ Add 5 new models to `models.py`
2. ✅ Create 4 new router files
3. ✅ Register routers in `main.py`
4. ✅ Run migrations: `alembic revision --autogenerate -m "add lms features"`
5. ✅ Apply: `alembic upgrade head`

### Frontend (30 minutes)
1. ✅ Create 3 new components
2. ✅ Add tabs to existing CoursePage
3. ✅ Add API functions to `api.ts`
4. ✅ Test in browser

---

## Testing

```bash
# Backend
curl http://localhost:8001/api/modules/courses/{course_id}/modules

# Frontend
# Navigate to course page and see new tabs
```

---

## Next Steps (Priority Order)

1. ✅ **Week 1**: Add Modules & Lessons (above)
2. ✅ **Week 2**: Add Assignments & Submissions
3. ✅ **Week 3**: Add Quizzes
4. ✅ **Week 4**: Add Discussions
5. ✅ **Week 5**: Add Gradebook

Each week builds on the previous without breaking existing features!

---

## Key Principle

**Add, don't replace.** Every new feature is:
- A new table (doesn't touch existing)
- A new router (doesn't modify existing)
- A new component (doesn't break existing)
- A new tab/page (existing pages still work)

Your current platform keeps working while you add features incrementally! 🚀
