import os
from pathlib import Path
from dotenv import load_dotenv

# Always resolve relative to this file, not the CWD you happen to launch from
env_path = Path(__file__).resolve().parent.parent / ".env"  # adjust .parent count to reach your .env
load_dotenv(dotenv_path=env_path)

class Settings:
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "insecure-dev-secret-change-me")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60 * 24 * 7
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./pathfinder.db")

settings = Settings()

# Debug: confirm the key loaded (mask it, don't print in full — this leaks the whole secret to logs)
_k = settings.GROQ_API_KEY
print(f"[config] GROQ_API_KEY loaded: {'yes' if _k else 'NO — check .env path'} (len={len(_k)})")