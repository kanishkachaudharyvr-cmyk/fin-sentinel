from datetime import datetime
from typing import Optional

from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from auth_utils import (
    create_session,
    extract_bearer,
    get_current_user,
    hash_password,
    optional_user,
    user_public,
    valid_email,
    verify_password,
)
from database import get_db, init_db
from graph_engine import active_cycles, find_or_create_cycle
from models import (
    AuthSession,
    DeviceConnection,
    DeviceNotification,
    FinancialProfile,
    RawNotification,
    User,
)
from nlp_engine import is_financial_notification, parse_notification
from stress_engine import profile_for_user, simulate, summary


app = FastAPI(title="FIN SENTINEL API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()


class NotificationIn(BaseModel):
    sender: str
    text: str


class AndroidNotificationIn(BaseModel):
    source: str = ""
    packageName: str = ""
    title: str = ""
    text: str = ""
    isEmi: bool = False
    amount: float | None = None
    dueDate: str = ""
    detectedAt: str = ""


class SimulationIn(BaseModel):
    proposed_amount: float = 0
    proposed_emi: float


class QueryIn(BaseModel):
    query: str


class DeviceNotificationIn(BaseModel):
    source: Optional[str] = None
    packageName: Optional[str] = None
    title: Optional[str] = None
    text: Optional[str] = None
    amount: Optional[float] = None
    dueDate: Optional[str] = None
    isEmi: bool = False
    detectedAt: Optional[str] = None


class SignupIn(BaseModel):
    name: str
    email: str
    password: str


class LoginIn(BaseModel):
    email: str
    password: str


class ProfileIn(BaseModel):
    monthly_income: float
    monthly_expenses: float = 0
    savings: float = 0


def init_financial_profile(db: Session, user: User) -> FinancialProfile:
    existing = db.query(FinancialProfile).filter(FinancialProfile.user_id == user.id).first()
    if existing:
        return existing
    profile = FinancialProfile(
        user_id=user.id,
        monthly_income=0,
        monthly_expenses=0,
        savings=0,
        dti_threshold=40.0,
        onboarding_completed=0,
        updated_at=datetime.utcnow(),
    )
    db.add(profile)
    db.flush()
    return profile


def device_connection(db: Session) -> DeviceConnection:
    conn = db.query(DeviceConnection).first()
    if not conn:
        conn = DeviceConnection()
        db.add(conn)
        db.flush()
    return conn


def ingest_user_id(db: Session, user: User | None) -> int | None:
    if user:
        return user.id
    conn = db.query(DeviceConnection).first()
    return conn.active_user_id if conn else None


def reconstruct_from_device(db: Session, payload: DeviceNotificationIn | AndroidNotificationIn, user_id: int | None, body: str):
    parsed = parse_notification(
        payload.title or payload.source or payload.packageName or "Unknown",
        body,
    )
    amount = payload.amount if payload.amount else parsed.get("amount")
    due = payload.dueDate or parsed.get("due_date")
    if payload.isEmi:
        parsed["intent"] = parsed.get("intent") if parsed.get("intent") != "NON_FINANCIAL" else "PAYMENT_REMINDER"
    if amount:
        parsed["amount"] = amount
    if due:
        parsed["due_date"] = due
    parsed["lender_name"] = parsed.get("lender_name") or payload.source or "Unknown lender"

    item = RawNotification(
        user_id=user_id,
        sender_id=parsed.get("lender_name") or "Unknown",
        body=body,
        language=parsed["language"],
        status="PROCESSED",
        received_at=datetime.utcnow(),
    )
    db.add(item)
    db.flush()
    find_or_create_cycle(db, parsed, item.id, user_id=user_id)
    return parsed


@app.get("/api/health")
def health():
    return {"ok": True}


@app.post("/api/auth/signup")
def signup(payload: SignupIn, db: Session = Depends(get_db)):
    name = payload.name.strip()
    email = payload.email.strip().lower()
    if not name:
        raise HTTPException(status_code=400, detail="Full name is required")
    if not valid_email(email):
        raise HTTPException(status_code=400, detail="Enter a valid email address")
    if len(payload.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="An account with this email already exists")
    user = User(name=name, email=email, password_hash=hash_password(payload.password))
    db.add(user)
    db.flush()
    profile = init_financial_profile(db, user)
    token = create_session(db, user)
    return {
        "token": token,
        "user": user_public(user, bool(profile.onboarding_completed)),
    }


@app.post("/api/auth/login")
def login(payload: LoginIn, db: Session = Depends(get_db)):
    email = payload.email.strip().lower()
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    profile = init_financial_profile(db, user)
    token = create_session(db, user)
    return {
        "token": token,
        "user": user_public(user, bool(profile.onboarding_completed)),
    }


@app.get("/api/auth/me")
def me(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = profile_for_user(db, user.id)
    return user_public(user, bool(profile.onboarding_completed))


@app.post("/api/auth/logout")
def logout_session(
    db: Session = Depends(get_db),
    authorization: Optional[str] = Header(default=None),
):
    token = extract_bearer(authorization)
    if token:
        session = db.query(AuthSession).filter(AuthSession.token == token).first()
        if session:
            db.delete(session)
            db.commit()
    return {"ok": True}


@app.post("/api/financial/profile")
def save_profile(
    payload: ProfileIn,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if payload.monthly_income < 0 or payload.monthly_expenses < 0 or payload.savings < 0:
        raise HTTPException(status_code=400, detail="Amounts cannot be negative")
    profile = profile_for_user(db, user.id)
    profile.monthly_income = payload.monthly_income
    profile.monthly_expenses = payload.monthly_expenses
    profile.savings = payload.savings
    profile.onboarding_completed = 1
    profile.updated_at = datetime.utcnow()
    db.commit()
    return summary(db, user.id)


@app.post("/api/device/claim")
def claim_device(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    conn = device_connection(db)
    conn.active_user_id = user.id
    conn.last_heartbeat = datetime.utcnow()
    db.commit()
    return {
        "ok": True,
        "active_user_id": user.id,
        "message": "This dashboard is now paired with the Android notification listener.",
    }


@app.post("/api/device/heartbeat")
def device_heartbeat(db: Session = Depends(get_db)):
    conn = device_connection(db)
    conn.last_heartbeat = datetime.utcnow()
    db.commit()
    return {
        "ok": True,
        "status": "ok",
        "message": "FIN SENTINEL device connected",
    }


@app.post("/api/device/notifications")
def device_notifications_post(payload: DeviceNotificationIn, db: Session = Depends(get_db)):
    conn = device_connection(db)
    conn.last_heartbeat = datetime.utcnow()
    user_id = ingest_user_id(db, None)
    body = payload.text or payload.title or ""
    financial = is_financial_notification(
        body,
        payload.source or "",
        payload.packageName or "",
        payload.isEmi,
    )
    notif = DeviceNotification(
        user_id=user_id,
        source_app=payload.source,
        package_name=payload.packageName,
        title=payload.title,
        notification_text=payload.text,
        is_emi=1 if payload.isEmi else 0,
        is_financial=1 if financial else 0,
        amount=payload.amount,
        due_date=payload.dueDate,
        detected_at=payload.detectedAt,
    )
    db.add(notif)
    db.flush()

    parsed = None
    should_reconstruct = payload.isEmi or financial
    if should_reconstruct and (payload.amount or parse_notification(payload.source or "", body).get("amount")):
        parsed = reconstruct_from_device(db, payload, user_id, body)

    db.commit()
    return {"status": "ok", "ok": True, "parsed": parsed}


@app.get("/api/device/notifications")
def device_notifications_get(
    financial_only: bool = True,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    conn = db.query(DeviceConnection).first()
    device_status = "Waiting for notification data"
    if conn:
        delta = (datetime.utcnow() - conn.last_heartbeat).total_seconds()
        if conn.active_user_id == user.id and delta < 60:
            device_status = "CONNECTED\nListening to device notifications"
        elif delta < 60:
            device_status = "Device online · pair this dashboard to receive live SMS"
        else:
            device_status = "STALE\nDevice not seen recently"

    query = db.query(DeviceNotification).filter(
        DeviceNotification.user_id == user.id,
        DeviceNotification.cleared_at.is_(None),
    )
    if financial_only:
        query = query.filter(DeviceNotification.is_financial == 1)
    records = []
    for n in query.order_by(DeviceNotification.received_at.desc()).limit(50).all():
        records.append({
            "id": str(n.id),
            "source": n.source_app or "Unknown",
            "amount": n.amount or 0,
            "dueDate": n.due_date or "",
            "notificationText": n.notification_text or n.title or "",
            "detectedAt": n.detected_at or n.received_at.isoformat(),
            "provenance": n.data_source,
            "isEmi": bool(n.is_emi),
            "isFinancial": bool(n.is_financial),
        })

    last_synced = conn.last_heartbeat.isoformat() if conn else None
    return {
        "records": records,
        "deviceStatus": device_status,
        "lastSynced": last_synced,
        "paired": bool(conn and conn.active_user_id == user.id),
    }


@app.post("/api/device/notifications/clear")
def clear_notifications(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    now = datetime.utcnow()
    rows = (
        db.query(DeviceNotification)
        .filter(
            DeviceNotification.user_id == user.id,
            DeviceNotification.cleared_at.is_(None),
        )
        .all()
    )
    for row in rows:
        row.cleared_at = now
    db.commit()
    return {"ok": True, "cleared": len(rows)}


@app.post("/api/notifications/ingest")
def ingest(
    payload: NotificationIn,
    db: Session = Depends(get_db),
    user: User | None = Depends(optional_user),
):
    parsed = parse_notification(payload.sender, payload.text)
    user_id = ingest_user_id(db, user)
    item = RawNotification(
        user_id=user_id,
        sender_id=payload.sender,
        body=payload.text,
        language=parsed["language"],
        status="PROCESSED",
        received_at=datetime.utcnow(),
    )
    db.add(item)
    db.flush()
    find_or_create_cycle(db, parsed, item.id, user_id=user_id)
    db.commit()
    return parsed


@app.get("/api/notifications/stream")
def stream(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return [
        {
            "id": n.id,
            "sender": n.sender_id,
            "text": n.body,
            "language": n.language,
            "received_at": n.received_at.isoformat(),
        }
        for n in db.query(RawNotification)
        .filter(RawNotification.user_id == user.id)
        .order_by(RawNotification.received_at.desc())
        .all()
    ]


@app.get("/api/repayments/calendar")
def calendar(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return [
        {
            "id": c.id,
            "amount": c.amount,
            "due_date": c.due_date.isoformat(),
            "status": c.status,
            "lender": c.loan.lender_name,
            "loan_type": c.loan.loan_type,
        }
        for c in active_cycles(db, user.id)
    ]


@app.get("/api/financial/summary")
def financial_summary(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return summary(db, user.id)


@app.post("/api/simulate")
def simulation(
    payload: SimulationIn,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return simulate(db, payload.proposed_emi, user.id)


@app.post("/api/query/assistant")
def assistant(
    payload: QueryIn,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cycles = active_cycles(db, user.id)
    cycle = cycles[0] if cycles else None
    if not cycle:
        return {"answer": "No pending repayments found."}
    if any(word in payload.query.lower() for word in ("meri", "agli", "kab", "when", "next")):
        return {
            "answer": (
                f"Your next repayment is "
                f"₹{cycle.amount:,.0f} "
                f"to {cycle.loan.lender_name} "
                f"on {cycle.due_date.strftime('%d %B %Y')}."
            )
        }
    return {"answer": f"I found {len(cycles)} pending repayments in your local graph."}
