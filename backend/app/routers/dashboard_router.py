import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, auth

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


def _student_overview(db: Session, student: models.User) -> dict:
    profile = db.query(models.Profile).filter(models.Profile.user_id == student.id).first()
    latest_quiz = (
        db.query(models.QuizResult)
        .filter(models.QuizResult.user_id == student.id)
        .order_by(models.QuizResult.created_at.desc())
        .first()
    )
    latest_roadmap = (
        db.query(models.Roadmap)
        .filter(models.Roadmap.user_id == student.id)
        .order_by(models.Roadmap.created_at.desc())
        .first()
    )
    return {
        "student": {"id": student.id, "name": student.name, "email": student.email, "class_level": student.class_level},
        "profile": {
            "interests": json.loads(profile.interests) if profile else [],
            "aptitude": json.loads(profile.aptitude) if profile else {},
            "personality": json.loads(profile.personality) if profile else {},
            "skills": json.loads(profile.skills) if profile else [],
            "summary": profile.summary if profile else "",
        },
        "latest_quiz_analysis": json.loads(latest_quiz.ai_analysis) if latest_quiz else None,
        "has_roadmap": latest_roadmap is not None,
        "roadmap_preview": json.loads(latest_roadmap.content).get("milestones", [])[:2] if latest_roadmap else [],
    }


@router.get("/student")
def student_dashboard(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="This dashboard is for student accounts.")
    return _student_overview(db, current_user)


@router.get("/parent")
def parent_dashboard(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "parent":
        raise HTTPException(status_code=403, detail="This dashboard is for parent accounts.")
    if not current_user.linked_student_email:
        raise HTTPException(status_code=400, detail="No student is linked to this parent account yet.")

    student = db.query(models.User).filter(models.User.email == current_user.linked_student_email).first()
    if not student:
        raise HTTPException(status_code=404, detail="Linked student account was not found.")

    return _student_overview(db, student)


@router.get("/teacher")
def teacher_dashboard(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="This dashboard is for teacher accounts.")

    students = db.query(models.User).filter(models.User.role == "student").all()
    roster = []
    for s in students:
        profile = db.query(models.Profile).filter(models.Profile.user_id == s.id).first()
        roster.append({
            "id": s.id,
            "name": s.name,
            "class_level": s.class_level,
            "interests": json.loads(profile.interests) if profile and profile.interests else [],
            "top_aptitude": _top_aptitude(profile),
            "has_taken_quiz": bool(profile and profile.summary),
        })
    return {"roster": roster}


def _top_aptitude(profile):
    if not profile or not profile.aptitude:
        return None
    try:
        data = json.loads(profile.aptitude)
        if not data:
            return None
        return max(data.items(), key=lambda kv: kv[1])[0]
    except Exception:
        return None
