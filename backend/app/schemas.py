from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any


# ---------- Auth ----------
class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "student"  # student | parent | teacher
    class_level: Optional[str] = None
    linked_student_email: Optional[EmailStr] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    class_level: Optional[str] = None

    class Config:
        from_attributes = True


# ---------- Profile ----------
class ProfileUpdate(BaseModel):
    interests: Optional[List[str]] = None
    skills: Optional[List[str]] = None
    target_careers: Optional[List[str]] = None
    class_level: Optional[str] = None


class ProfileOut(BaseModel):
    interests: List[str]
    aptitude: Dict[str, Any]
    personality: Dict[str, Any]
    skills: List[str]
    target_careers: List[str]
    summary: str


# ---------- Quiz ----------
class QuizAnswer(BaseModel):
    question: str
    category: str
    answer: str


class QuizSubmit(BaseModel):
    answers: List[QuizAnswer]


# ---------- Mentor ----------
class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Dict[str, str]]] = None


# ---------- Skills ----------
class SkillGapRequest(BaseModel):
    current_skills: List[str]
    target_career: str


# ---------- Roadmap ----------
class RoadmapRequest(BaseModel):
    target_career: Optional[str] = None
    age: Optional[int] = None


# ---------- Career simulation ----------
class SimulateRequest(BaseModel):
    career_id: str
