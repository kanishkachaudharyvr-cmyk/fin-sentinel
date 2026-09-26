import hashlib
import hmac
import re
import secrets
from datetime import datetime, timedelta

from fastapi import Depends, Header, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import AuthSession, User

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
PBKDF2_ROUNDS = 180_000


def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        PBKDF2_ROUNDS,
    ).hex()
    return f"{salt}${digest}"


def verify_password(password: str, stored: str) -> bool:
    try:
        salt, digest = stored.split("$", 1)
    except ValueError:
        return False
    check = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        PBKDF2_ROUNDS,
    ).hex()
    return hmac.compare_digest(check, digest)


def valid_email(value: str) -> bool:
    return bool(EMAIL_RE.match(value.strip().lower()))


def create_session(db: Session, user: User) -> str:
    token = secrets.token_urlsafe(32)
    db.add(
        AuthSession(
            token=token,
            user_id=user.id,
            expires_at=datetime.utcnow() + timedelta(days=7),
        )
    )
    db.commit()
    return token


def user_from_token(db: Session, token: str | None) -> User | None:
    if not token:
        return None
    session = db.query(AuthSession).filter(AuthSession.token == token).first()
    if not session or session.expires_at < datetime.utcnow():
        return None
    return db.query(User).filter(User.id == session.user_id).first()


def extract_bearer(authorization: str | None) -> str | None:
    if not authorization:
        return None
    prefix = "Bearer "
    if authorization.startswith(prefix):
        return authorization[len(prefix):].strip()
    return authorization.strip()


def get_current_user(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
) -> User:
    user = user_from_token(db, extract_bearer(authorization))
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    return user


def optional_user(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
) -> User | None:
    return user_from_token(db, extract_bearer(authorization))


def user_public(user: User, onboarding_completed: bool = False):
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "onboarding_completed": bool(onboarding_completed),
    }
