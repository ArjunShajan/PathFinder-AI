from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="student")  # student | parent | teacher
    class_level = Column(String, nullable=True)  # e.g. "Class 7", "College - Year 2"
    linked_student_email = Column(String, nullable=True)  # for parent accounts
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("Profile", back_populates="user", uselist=False)
    quiz_results = relationship("QuizResult", back_populates="user")
    roadmaps = relationship("Roadmap", back_populates="user")
    skill_reports = relationship("SkillGapReport", back_populates="user")
    chat_messages = relationship("ChatMessage", back_populates="user")


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    interests = Column(Text, default="[]")       # JSON list
    aptitude = Column(Text, default="{}")         # JSON dict
    personality = Column(Text, default="{}")      # JSON dict
    skills = Column(Text, default="[]")           # JSON list
    target_careers = Column(Text, default="[]")   # JSON list
    summary = Column(Text, default="")            # AI-generated narrative summary
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profile")


class QuizResult(Base):
    __tablename__ = "quiz_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    answers = Column(Text, default="[]")     # JSON list of {question, answer, category}
    ai_analysis = Column(Text, default="{}")  # JSON dict: strengths, career_matches, summary
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="quiz_results")


class Roadmap(Base):
    __tablename__ = "roadmaps"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    target_career = Column(String, nullable=True)
    content = Column(Text, default="{}")  # JSON dict: milestones
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="roadmaps")


class SkillGapReport(Base):
    __tablename__ = "skill_gap_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    target_career = Column(String, nullable=True)
    current_skills = Column(Text, default="[]")
    content = Column(Text, default="{}")  # JSON dict: gaps, recommendations
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="skill_reports")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    role = Column(String)  # "user" | "assistant"
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="chat_messages")
