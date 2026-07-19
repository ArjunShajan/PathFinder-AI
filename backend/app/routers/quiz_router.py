import json
import os
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas, auth
from app.groq_service import groq_json

router = APIRouter(prefix="/api/quiz", tags=["quiz"])

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "quiz_bank.json")


@router.get("/questions")
def get_questions():
    with open(DATA_PATH) as f:
        return json.load(f)


@router.post("/submit")
def submit_quiz(
    payload: schemas.QuizSubmit,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    answers_list = [a.model_dump() for a in payload.answers]

    system_prompt = (
        "You are an expert career-guidance psychologist and educational counselor for school and college "
        "students in India. You analyze quiz answers to build a holistic student profile covering interests, "
        "aptitude, personality traits, and emerging skills. You then match the profile to realistic, diverse "
        "career paths."
    )
    user_prompt = f"""
Student name: {current_user.name}
Student class/level: {current_user.class_level or "Not specified"}

Quiz answers (category, question, chosen answer):
{json.dumps(answers_list, indent=2)}

Analyze this and return a JSON object with EXACTLY these keys:
{{
  "interests": ["3-6 short interest tags derived from answers"],
  "aptitude": {{"logical_reasoning": 0-100, "creativity": 0-100, "communication": 0-100, "numerical_ability": 0-100, "spatial_thinking": 0-100}},
  "personality": {{"traits": ["3-5 short personality trait words"], "work_style": "one short sentence describing preferred work style"}},
  "skills_to_develop": ["3-6 concrete skills worth developing next, based on answers"],
  "career_matches": [
    {{"title": "career title", "match_percent": 0-100, "why": "one sentence reason tailored to this student's answers"}}
  ],
  "summary": "a warm, encouraging 3-4 sentence narrative summary of this student's emerging profile, written directly to the student"
}}
Provide 4-6 career_matches, ordered by match_percent descending. Keep it grounded, specific, and age-appropriate — never prescriptive or pressuring.
"""
    analysis = groq_json(system_prompt, user_prompt)

    quiz_result = models.QuizResult(
        user_id=current_user.id,
        answers=json.dumps(answers_list),
        ai_analysis=json.dumps(analysis),
    )
    db.add(quiz_result)

    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    if not profile:
        profile = models.Profile(user_id=current_user.id)
        db.add(profile)

    if isinstance(analysis, dict):
        if analysis.get("interests"):
            profile.interests = json.dumps(analysis["interests"])
        if analysis.get("aptitude"):
            profile.aptitude = json.dumps(analysis["aptitude"])
        if analysis.get("personality"):
            profile.personality = json.dumps(analysis["personality"])
        if analysis.get("skills_to_develop"):
            profile.skills = json.dumps(analysis["skills_to_develop"])
        if analysis.get("summary"):
            profile.summary = analysis["summary"]

    db.commit()
    db.refresh(quiz_result)

    return {"id": quiz_result.id, "analysis": analysis}


@router.get("/result/latest")
def latest_result(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    result = (
        db.query(models.QuizResult)
        .filter(models.QuizResult.user_id == current_user.id)
        .order_by(models.QuizResult.created_at.desc())
        .first()
    )
    if not result:
        return None
    return {
        "id": result.id,
        "answers": json.loads(result.answers or "[]"),
        "analysis": json.loads(result.ai_analysis or "{}"),
        "created_at": result.created_at.isoformat(),
    }
