"""
Thin wrapper around the Groq chat completions API.
Docs: https://console.groq.com/docs/quickstart
"""
import json
import requests
from fastapi import HTTPException
from app.config import settings

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"


def _call_groq(messages: list, json_mode: bool = False, temperature: float = 0.7, max_tokens: int = 1500) -> str:
    # .strip() guards against a trailing space/newline in .env, which causes
    # Groq to return "Invalid API Key" even though the key itself is correct.
    api_key = (settings.GROQ_API_KEY or "").strip()

    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="GROQ_API_KEY is not set on the server. Add it to backend/.env and restart the server.",
        )

    # --- TEMPORARY DEBUG LOG: remove once the key issue is confirmed fixed ---
    print(f"[groq_client] Using key: {api_key[:8]}...{api_key[-4:]} (len={len(api_key)})")
    # ---------------------------------------------------------------------

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": settings.GROQ_MODEL,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
    }
    if json_mode:
        payload["response_format"] = {"type": "json_object"}

    try:
        resp = requests.post(GROQ_URL, headers=headers, json=payload, timeout=60)
        resp.raise_for_status()
    except requests.exceptions.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"Groq API error: {e.response.text}") from e
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Could not reach Groq API: {e}") from e

    data = resp.json()
    return data["choices"][0]["message"]["content"]


def groq_json(system_prompt: str, user_prompt: str, temperature: float = 0.6) -> dict:
    """Call Groq and force a JSON object response, with a safe fallback parse."""
    content = _call_groq(
        [
            {"role": "system", "content": system_prompt + "\nAlways respond with a single valid JSON object only, no prose, no markdown fences."},
            {"role": "user", "content": user_prompt},
        ],
        json_mode=True,
        temperature=temperature,
    )
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        # strip accidental markdown fences and retry
        cleaned = content.strip().strip("`")
        if cleaned.lower().startswith("json"):
            cleaned = cleaned[4:]
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            return {"raw": content}


def groq_text(system_prompt: str, user_prompt: str, history: list = None, temperature: float = 0.7) -> str:
    messages = [{"role": "system", "content": system_prompt}]
    if history:
        messages.extend(history)
    messages.append({"role": "user", "content": user_prompt})
    return _call_groq(messages, json_mode=False, temperature=temperature)