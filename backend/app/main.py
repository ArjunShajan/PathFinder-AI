from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app import models  # noqa: F401 - ensures models are registered before create_all
from app.routers import (
    auth_router,
    profile_router,
    quiz_router,
    careers_router,
    mentor_router,
    skills_router,
    roadmap_router,
    dashboard_router,
)

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PathFinder AI API",
    description="Intelligent Career Discovery & Skill Development Platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # relax for local/dev use; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(profile_router.router)
app.include_router(quiz_router.router)
app.include_router(careers_router.router)
app.include_router(mentor_router.router)
app.include_router(skills_router.router)
app.include_router(roadmap_router.router)
app.include_router(dashboard_router.router)


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "PathFinder AI API"}
