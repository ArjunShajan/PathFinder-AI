import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/api/profile", tags=["profile"])


def _profile_to_out(profile: models.Profile) -> schemas.ProfileOut:
    return schemas.ProfileOut(
        interests=json.loads(profile.interests or "[]"),
        aptitude=json.loads(profile.aptitude or "{}"),
        personality=json.loads(profile.personality or "{}"),
        skills=json.loads(profile.skills or "[]"),
        target_careers=json.loads(profile.target_careers or "[]"),
        summary=profile.summary or "",
    )


@router.get("", response_model=schemas.ProfileOut)
def get_profile(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    if not profile:
        profile = models.Profile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return _profile_to_out(profile)


@router.put("", response_model=schemas.ProfileOut)
def update_profile(
    payload: schemas.ProfileUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found.")

    if payload.interests is not None:
        profile.interests = json.dumps(payload.interests)
    if payload.skills is not None:
        profile.skills = json.dumps(payload.skills)
    if payload.target_careers is not None:
        profile.target_careers = json.dumps(payload.target_careers)
    if payload.class_level is not None:
        current_user.class_level = payload.class_level

    db.commit()
    db.refresh(profile)
    return _profile_to_out(profile)
