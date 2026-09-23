from datetime import datetime

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db, init_db
from graph_engine import active_cycles, find_or_create_cycle
from models import LoanObligation, RawNotification
from nlp_engine import parse_notification
from stress_engine import simulate, summary


app = FastAPI(title="FIN SENTINEL API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()


# ============================================================
# REQUEST MODELS
# ============================================================

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


# ============================================================
# HEALTH
# ============================================================

@app.get("/api/health")
def health():
    return {"ok": True}


# ============================================================
# ANDROID DEVICE HEARTBEAT
# ============================================================

@app.post("/api/device/heartbeat")
def device_heartbeat():
    return {
        "ok": True,
        "message": "FIN SENTINEL device connected"
    }


# ============================================================
# EXISTING NOTIFICATION INGEST
# ============================================================

@app.post("/api/notifications/ingest")
def ingest(
    payload: NotificationIn,
    db: Session = Depends(get_db)
):
    parsed = parse_notification(
        payload.sender,
        payload.text
    )

    item = RawNotification(
        sender_id=payload.sender,
        body=payload.text,
        language=parsed["language"],
        status="PROCESSED",
        received_at=datetime.utcnow()
    )

    db.add(item)
    db.flush()

    find_or_create_cycle(
        db,
        parsed,
        item.id
    )

    db.commit()

    return parsed


# ============================================================
# ANDROID EMI NOTIFICATION
# ============================================================

@app.post("/api/device/notifications")
def receive_android_notification(
    payload: AndroidNotificationIn,
    db: Session = Depends(get_db)
):
    # Ignore anything that Android says is not an EMI notification
    if not payload.isEmi:
        return {
            "ok": True,
            "message": "Notification ignored because it is not EMI-related"
        }

    # Use the Android notification title as sender.
    # If title is empty, use the source package instead.
    sender = payload.title or payload.source or payload.packageName

    # Send the notification through the existing FIN SENTINEL
    # notification-processing pipeline.
    parsed = parse_notification(
        sender,
        payload.text
    )

    item = RawNotification(
        sender_id=sender,
        body=payload.text,
        language=parsed["language"],
        status="PROCESSED",
        received_at=datetime.utcnow()
    )

    db.add(item)
    db.flush()

    find_or_create_cycle(
        db,
        parsed,
        item.id
    )

    db.commit()

    return {
        "ok": True,
        "message": "EMI notification received successfully",
        "amount": payload.amount,
        "dueDate": payload.dueDate,
        "source": payload.source,
        "packageName": payload.packageName,
        "parsed": parsed
    }


# ============================================================
# NOTIFICATION STREAM
# ============================================================

@app.get("/api/notifications/stream")
def stream(
    db: Session = Depends(get_db)
):
    return [
        {
            "id": n.id,
            "sender": n.sender_id,
            "text": n.body,
            "language": n.language,
            "received_at": n.received_at.isoformat()
        }
        for n in db.query(RawNotification)
        .order_by(RawNotification.received_at.desc())
        .all()
    ]


# ============================================================
# REPAYMENT CALENDAR
# ============================================================

@app.get("/api/repayments/calendar")
def calendar(
    db: Session = Depends(get_db)
):
    return [
        {
            "id": c.id,
            "amount": c.amount,
            "due_date": c.due_date.isoformat(),
            "status": c.status,
            "lender": c.loan.lender_name,
            "loan_type": c.loan.loan_type
        }
        for c in active_cycles(db)
    ]


# ============================================================
# FINANCIAL SUMMARY
# ============================================================

@app.get("/api/financial/summary")
def financial_summary(
    db: Session = Depends(get_db)
):
    return summary(db)


# ============================================================
# SIMULATION
# ============================================================

@app.post("/api/simulate")
def simulation(
    payload: SimulationIn,
    db: Session = Depends(get_db)
):
    return simulate(
        db,
        payload.proposed_emi
    )


# ============================================================
# ASSISTANT
# ============================================================

@app.post("/api/query/assistant")
def assistant(
    payload: QueryIn,
    db: Session = Depends(get_db)
):
    cycles = active_cycles(db)

    cycle = cycles[0] if cycles else None

    if not cycle:
        return {
            "answer": "No pending repayments found."
        }

    if any(
        word in payload.query.lower()
        for word in ("meri", "agli", "kab", "when", "next")
    ):
        return {
            "answer": (
                f"Your next repayment is "
                f"₹{cycle.amount:,.0f} "
                f"to {cycle.loan.lender_name} "
                f"on {cycle.due_date.strftime('%d %B %Y')}."
            )
        }

    return {
        "answer": (
            f"I found {len(cycles)} "
            f"pending repayments in your local graph."
        )
    }