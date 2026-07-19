import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas, auth
from app.groq_service import groq_json

router = APIRouter(prefix="/api/roadmap", tags=["roadmap"])


@router.post("/generate")
def generate_roadmap(
    payload: schemas.RoadmapRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    interests = json.loads(profile.interests) if profile and profile.interests else []
    skills = json.loads(profile.skills) if profile and profile.skills else []

    system_prompt = (
        "You are an educational planner who builds personalized, year-by-year learning roadmaps for students, "
        "from their current stage through higher education, tailored to their interests and target career."
    )
    user_prompt = f"""
Student: {current_user.name}
Current level: {current_user.class_level or "not specified"}
Interests: {json.dumps(interests)}
Existing skills: {json.dumps(skills)}
Target career (optional): {payload.target_career or "not specified — infer a good direction from interests"}

Return a JSON object with EXACTLY these keys:
{{
  "target_career": "the inferred or given target career",
  "milestones": [
    {{"stage": "e.g. 'Class 8' or 'Class 11-12' or 'College Year 1'", "focus": "one sentence theme for this stage", "skills_to_build": ["2-4 skills"], "activities": ["2-4 concrete activities, competitions, or resources"]}}
  ],
  "checkpoints": ["3-5 milestone checkpoints the student can look forward to hitting"]
}}
Include 4-6 milestones covering from the student's current stage through graduation, in chronological order.
"""
    result = groq_json(system_prompt, user_prompt)

    roadmap = models.Roadmap(
        user_id=current_user.id,
        target_career=payload.target_career or (result.get("target_career") if isinstance(result, dict) else None),
        content=json.dumps(result),
    )
    db.add(roadmap)
    db.commit()
    db.refresh(roadmap)

    return {"id": roadmap.id, "result": result}


@router.get("/latest")
def latest_roadmap(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    roadmap = (
        db.query(models.Roadmap)
        .filter(models.Roadmap.user_id == current_user.id)
        .order_by(models.Roadmap.created_at.desc())
        .first()
    )
    if not roadmap:
        return None
    return {"id": roadmap.id, "result": json.loads(roadmap.content or "{}"), "created_at": roadmap.created_at.isoformat()}
