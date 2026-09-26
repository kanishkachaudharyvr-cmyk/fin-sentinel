from datetime import datetime
from typing import Optional

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db, init_db
from graph_engine import active_cycles, find_or_create_cycle
from models import LoanObligation, RawNotification, DeviceNotification, DeviceConnection
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


class DeviceNotificationIn(BaseModel):
    source: Optional[str] = None
    packageName: Optional[str] = None
    title: Optional[str] = None
    text: Optional[str] = None
    amount: Optional[float] = None
    dueDate: Optional[str] = None
    isEmi: bool = False
    detectedAt: Optional[str] = None


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
    return {
        "ok": True
    }


# ============================================================
# ANDROID DEVICE HEARTBEAT
# ============================================================

@app.post("/api/device/heartbeat")
def device_heartbeat(db: Session = Depends(get_db)):
    conn = db.query(DeviceConnection).first()

    if not conn:
        conn = DeviceConnection()
        db.add(conn)

    conn.last_heartbeat = datetime.utcnow()

    db.commit()

    return {
        "status": "ok",
        "message": "FIN SENTINEL device connected"
    }


# ============================================================
# ANDROID EMI NOTIFICATION
# ============================================================

@app.post("/api/device/notifications")
def receive_android_notification(
    payload: AndroidNotificationIn,
    db: Session = Depends(get_db)
):
    # --------------------------------------------------------
    # Ignore non-EMI notifications
    # --------------------------------------------------------

    if not payload.isEmi:
        return {
            "ok": True,
            "message": "Notification ignored because it is not EMI-related"
        }

    # --------------------------------------------------------
    # Update device heartbeat
    # --------------------------------------------------------

    conn = db.query(DeviceConnection).first()

    if not conn:
        conn = DeviceConnection()
        db.add(conn)

    conn.last_heartbeat = datetime.utcnow()

    # --------------------------------------------------------
    # Store raw Android notification
    # --------------------------------------------------------

    notification = DeviceNotification(
        source_app=payload.source,
        package_name=payload.packageName,
        title=payload.title,
        notification_text=payload.text,
        is_emi=1 if payload.isEmi else 0,
        amount=payload.amount,
        due_date=payload.dueDate,
        detected_at=payload.detectedAt
    )

    db.add(notification)
    db.flush()

    # --------------------------------------------------------
    # Parse notification using FIN SENTINEL NLP engine
    # --------------------------------------------------------

    sender = (
        payload.title
        or payload.source
        or payload.packageName
        or "Unknown sender"
    )

    parsed = parse_notification(
        sender,
        payload.text
    )

    # --------------------------------------------------------
    # Make sure the fields required by graph_engine exist
    # --------------------------------------------------------

    parsed.setdefault(
        "lender_name",
        sender
    )

    parsed.setdefault(
        "amount",
        payload.amount
    )

    parsed.setdefault(
        "due_date",
        payload.dueDate
    )

    parsed.setdefault(
        "language",
        "English"
    )

    # --------------------------------------------------------
    # Use Android amount when NLP amount extraction fails
    # --------------------------------------------------------

    if parsed.get("amount") is None and payload.amount is not None:
        parsed["amount"] = payload.amount

    # --------------------------------------------------------
    # Use Android due date when NLP date extraction fails
    # --------------------------------------------------------

    if parsed.get("due_date") is None and payload.dueDate:
        parsed["due_date"] = payload.dueDate

    # --------------------------------------------------------
    # Store notification in the existing reconstruction pipeline
    # --------------------------------------------------------

    item = RawNotification(
        sender_id=sender,
        body=payload.text,
        language=parsed.get("language", "English"),
        status="PROCESSED",
        received_at=datetime.utcnow()
    )

    db.add(item)
    db.flush()

    # --------------------------------------------------------
    # Create/update repayment cycle
    # --------------------------------------------------------

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
# DEVICE NOTIFICATION STREAM
# ============================================================

@app.get("/api/device/notifications")
def device_notifications_get(
    db: Session = Depends(get_db)
):
    conn = db.query(DeviceConnection).first()

    device_status = "Waiting for notification data"

    if conn:
        delta = (
            datetime.utcnow() - conn.last_heartbeat
        ).total_seconds()

        if delta < 60:
            device_status = (
                "CONNECTED\n"
                "Listening to device notifications"
            )
        else:
            device_status = (
                "STALE\n"
                "Device not seen recently"
            )

    records = []

    notifications = (
        db.query(DeviceNotification)
        .order_by(DeviceNotification.received_at.desc())
        .limit(50)
        .all()
    )

    for notification in notifications:
        records.append({
            "id": str(notification.id),
            "source": notification.source_app or "Unknown",
            "amount": notification.amount or 0,
            "dueDate": notification.due_date or "",
            "notificationText": (
                notification.notification_text
                or notification.title
                or ""
            ),
            "detectedAt": (
                notification.detected_at
                or notification.received_at.isoformat()
            ),
            "provenance": notification.data_source,
            "isEmi": bool(notification.is_emi)
        })

    last_synced = (
        conn.last_heartbeat.isoformat()
        if conn
        else None
    )

    return {
        "records": records,
        "deviceStatus": device_status,
        "lastSynced": last_synced
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

    parsed.setdefault(
        "lender_name",
        payload.sender or "Unknown lender"
    )

    item = RawNotification(
        sender_id=payload.sender,
        body=payload.text,
        language=parsed.get("language", "English"),
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
        for n in (
            db.query(RawNotification)
            .order_by(RawNotification.received_at.desc())
            .all()
        )
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
        for word in (
            "meri",
            "agli",
            "kab",
            "when",
            "next"
        )
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