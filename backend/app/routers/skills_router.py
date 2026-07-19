import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas, auth
from app.groq_service import groq_json

router = APIRouter(prefix="/api/skills", tags=["skills"])


@router.post("/gap-analysis")
def gap_analysis(
    payload: schemas.SkillGapRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    system_prompt = (
        "You are a career skills advisor. You compare a student's current skills against what's needed for "
        "their target career and produce a clear, motivating, actionable gap analysis."
    )
    user_prompt = f"""
Student: {current_user.name}, level: {current_user.class_level or "not specified"}
Current skills: {json.dumps(payload.current_skills)}
Target career: {payload.target_career}

Return a JSON object with EXACTLY these keys:
{{
  "target_career": "{payload.target_career}",
  "readiness_percent": 0-100,
  "matched_skills": ["skills the student already has that are relevant"],
  "skill_gaps": [
    {{"skill": "skill name", "priority": "High|Medium|Low", "why_it_matters": "one sentence", "how_to_learn": "one concrete suggestion (course/project/activity)"}}
  ],
  "recommended_next_steps": ["3-5 short, ordered, concrete next actions"],
  "encouragement": "one warm, specific, motivating sentence"
}}
Include 3-6 skill_gaps ordered by priority (High first).
"""
    result = groq_json(system_prompt, user_prompt)

    report = models.SkillGapReport(
        user_id=current_user.id,
        target_career=payload.target_career,
        current_skills=json.dumps(payload.current_skills),
        content=json.dumps(result),
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    return {"id": report.id, "result": result}


@router.get("/history")
def get_history(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    reports = (
        db.query(models.SkillGapReport)
        .filter(models.SkillGapReport.user_id == current_user.id)
        .order_by(models.SkillGapReport.created_at.desc())
        .all()
    )
    return [
        {
            "id": r.id,
            "target_career": r.target_career,
            "result": json.loads(r.content or "{}"),
            "created_at": r.created_at.isoformat(),
        }
        for r in reports
    ]
