import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas, auth
from app.groq_service import groq_text

router = APIRouter(prefix="/api/mentor", tags=["mentor"])


@router.post("/chat")
def chat(
    payload: schemas.ChatRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    profile_context = "No profile data yet — encourage the student to take the Career Discovery Quiz first."
    if profile and (profile.summary or profile.interests != "[]"):
        profile_context = f"""
Interests: {profile.interests}
Aptitude: {profile.aptitude}
Personality: {profile.personality}
Skills: {profile.skills}
Target careers of interest: {profile.target_careers}
Summary: {profile.summary}
"""

    system_prompt = f"""You are PathFinder AI Mentor — a warm, encouraging, knowledgeable career and academic
guidance mentor for a student named {current_user.name} ({current_user.class_level or "level not specified"}).

Student profile context:
{profile_context}

Guidelines:
- Give specific, honest, age-appropriate guidance grounded in the student's actual profile when relevant.
- Never pressure the student toward one path; present options with tradeoffs.
- When discussing stream/subject choices, mention practical next steps (subjects, exams, skills to build).
- Keep responses conversational and focused, generally under 180 words unless the student asks for depth.
- If asked something outside career/academic guidance, gently redirect back to how you can help with their journey.
"""

    # Save the user's message
    db.add(models.ChatMessage(user_id=current_user.id, role="user", content=payload.message))
    db.commit()

    history = payload.history or []
    reply = groq_text(system_prompt, payload.message, history=history)

    db.add(models.ChatMessage(user_id=current_user.id, role="assistant", content=reply))
    db.commit()

    return {"reply": reply}


@router.get("/history")
def get_history(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    messages = (
        db.query(models.ChatMessage)
        .filter(models.ChatMessage.user_id == current_user.id)
        .order_by(models.ChatMessage.created_at.asc())
        .all()
    )
    return [{"role": m.role, "content": m.content} for m in messages]
