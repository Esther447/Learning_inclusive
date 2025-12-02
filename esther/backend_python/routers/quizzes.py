# backend_python/routers/quizzes.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import uuid4, UUID
from typing import List

from backend_python.database import get_db
from backend_python.models import Quiz, Question, Submission, User
from backend_python.schemas import QuizCreate, QuizOut, QuestionCreate, SubmissionIn, SubmissionOut
from backend_python.auth_utils import get_current_user

router = APIRouter()

@router.post("/", response_model=QuizOut, status_code=status.HTTP_201_CREATED)
def create_quiz(payload: QuizCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    q = Quiz(id=str(uuid4()), course_id=str(payload.course_id), title=payload.title, description=payload.description)
    db.add(q)
    db.commit()
    db.refresh(q)
    return QuizOut.model_validate(q)

@router.post("/{quiz_id}/questions", status_code=status.HTTP_201_CREATED)
def add_question(quiz_id: UUID, payload: QuestionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    q = db.query(Quiz).filter(Quiz.id == str(quiz_id)).first()
    if not q:
        raise HTTPException(status_code=404, detail="Quiz not found")
    question = Question(id=str(uuid4()), quiz_id=str(quiz_id), prompt=payload.prompt, options=payload.options, answer=payload.answer)
    db.add(question)
    db.commit()
    db.refresh(question)
    return {"id": question.id, "prompt": question.prompt}

@router.post("/{quiz_id}/submit", response_model=SubmissionOut, status_code=status.HTTP_201_CREATED)
def submit_quiz(quiz_id: UUID, payload: SubmissionIn, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # very basic scoring: compare answers to stored 'answer' fields for each question
    questions = db.query(Question).filter(Question.quiz_id == str(quiz_id)).all()
    correct = 0
    total = len(questions)
    qmap = {q.id: q for q in questions}
    for qid, ans in payload.answers.items():
        if qid in qmap and qmap[qid].answer is not None and str(qmap[qid].answer) == str(ans):
            correct += 1
    score = int((correct / total) * 100) if total > 0 else 0
    s = Submission(id=str(uuid4()), user_id=str(current_user.id), quiz_id=str(quiz_id), answers=payload.answers, score=score)
    db.add(s)
    db.commit()
    db.refresh(s)
    return SubmissionOut.model_validate(s)
