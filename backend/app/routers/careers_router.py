import json
import os
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, auth
from app.groq_service import groq_json

router = APIRouter(prefix="/api/careers", tags=["careers"])

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "careers.json")


def _load_careers():
    with open(DATA_PATH) as f:
        return json.load(f)


@router.get("")
def list_careers():
    return _load_careers()


@router.get("/{career_id}")
def get_career(career_id: str):
    for c in _load_careers():
        if c["id"] == career_id:
            return c
    raise HTTPException(status_code=404, detail="Career not found.")


@router.post("/{career_id}/simulate")
def simulate_career(
    career_id: str,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    career = None
    for c in _load_careers():
        if c["id"] == career_id:
            career = c
            break
    if not career:
        raise HTTPException(status_code=404, detail="Career not found.")

    system_prompt = (
        "You are designing an interactive 'day in the life' career simulation for a student exploring careers. "
        "Keep it vivid, realistic, and age-appropriate, and structure it as a short branching scenario."
    )
    user_prompt = f"""
Career: {career['title']} ({career['category']})
Nature of work: {career['nature_of_work']}
Student class/level: {current_user.class_level or "not specified"}

Create a short interactive simulation as a JSON object with EXACTLY these keys:
{{
  "intro": "1-2 sentence scene-setting intro putting the student in the role",
  "scenes": [
    {{
      "time": "e.g. 9:00 AM",
      "situation": "1-2 sentences describing a realistic situation or decision point in this job",
      "choices": ["choice A", "choice B", "choice C"],
      "best_choice_insight": "1 sentence explaining what a strong choice looks like and why, without being preachy"
    }}
  ],
  "closing_reflection": "1-2 sentences encouraging the student to reflect on whether they enjoyed this simulated day"
}}
Include exactly 4 scenes spanning a typical working day, in chronological order.
"""
    simulation = groq_json(system_prompt, user_prompt)
    return {"career": career, "simulation": simulation}
