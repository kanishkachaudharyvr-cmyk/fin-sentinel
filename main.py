from datetime import datetime
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db, init_db
from graph_engine import active_cycles, find_or_create_cycle
from models import LoanObligation, RawNotification, DeviceNotification, DeviceConnection
from nlp_engine import parse_notification
from stress_engine import simulate, summary
from typing import Optional

app = FastAPI(title="FIN SENTINEL API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
init_db()

class NotificationIn(BaseModel): sender: str; text: str
class SimulationIn(BaseModel): proposed_amount: float = 0; proposed_emi: float
class QueryIn(BaseModel): query: str

class DeviceNotificationIn(BaseModel):
    source: Optional[str] = None
    packageName: Optional[str] = None
    title: Optional[str] = None
    text: Optional[str] = None
    amount: Optional[float] = None
    dueDate: Optional[str] = None
    isEmi: bool = False
    detectedAt: Optional[str] = None

@app.get("/api/health")
def health(): return {"ok": True}

@app.post("/api/device/heartbeat")
def device_heartbeat(db: Session = Depends(get_db)):
    conn = db.query(DeviceConnection).first()
    if not conn:
        conn = DeviceConnection()
        db.add(conn)
    conn.last_heartbeat = datetime.utcnow()
    db.commit()
    return {"status": "ok"}

@app.post("/api/device/notifications")
def device_notifications_post(payload: DeviceNotificationIn, db: Session = Depends(get_db)):
    # Update heartbeat implicitly on valid notification
    conn = db.query(DeviceConnection).first()
    if not conn:
        conn = DeviceConnection()
        db.add(conn)
    conn.last_heartbeat = datetime.utcnow()
    
    notif = DeviceNotification(
        source_app=payload.source,
        package_name=payload.packageName,
        title=payload.title,
        notification_text=payload.text,
        is_emi=1 if payload.isEmi else 0,
        amount=payload.amount,
        due_date=payload.dueDate,
        detected_at=payload.detectedAt
    )
    db.add(notif)
    db.flush()
    
    # Connect to existing reconstruction pipeline if it's an EMI
    if payload.isEmi and payload.amount and payload.dueDate:
        parsed = {
            "is_emi": True,
            "amount": payload.amount,
            "due_date": payload.dueDate,
            "lender": payload.source or payload.packageName or "Unknown",
            "language": "English",
            "confidence": 0.95
        }
        item = RawNotification(sender_id=parsed["lender"], body=payload.text or "", language="English", status="PROCESSED", received_at=datetime.utcnow())
        db.add(item)
        db.flush()
        find_or_create_cycle(db, parsed, item.id)
        
    db.commit()
    return {"status": "ok"}

@app.get("/api/device/notifications")
def device_notifications_get(db: Session = Depends(get_db)):
    conn = db.query(DeviceConnection).first()
    device_status = "Waiting for notification data"
    if conn:
        delta = (datetime.utcnow() - conn.last_heartbeat).total_seconds()
        if delta < 60:
            device_status = "CONNECTED\nListening to device notifications"
        else:
            device_status = "STALE\nDevice not seen recently"

    records = []
    for n in db.query(DeviceNotification).order_by(DeviceNotification.received_at.desc()).limit(50).all():
        records.append({
            "id": str(n.id),
            "source": n.source_app or "Unknown",
            "amount": n.amount or 0,
            "dueDate": n.due_date or "",
            "notificationText": n.notification_text or n.title or "",
            "detectedAt": n.detected_at or n.received_at.isoformat(),
            "provenance": n.data_source,
            "isEmi": bool(n.is_emi)
        })
    
    last_synced = conn.last_heartbeat.isoformat() if conn else None
    
    return {
        "records": records,
        "deviceStatus": device_status,
        "lastSynced": last_synced
    }

@app.post("/api/notifications/ingest")
def ingest(payload: NotificationIn, db: Session = Depends(get_db)):
    parsed = parse_notification(payload.sender, payload.text)
    item = RawNotification(sender_id=payload.sender, body=payload.text, language=parsed["language"], status="PROCESSED", received_at=datetime.utcnow())
    db.add(item); db.flush(); find_or_create_cycle(db, parsed, item.id); db.commit()
    return parsed

@app.get("/api/notifications/stream")
def stream(db: Session = Depends(get_db)):
    return [{"id": n.id, "sender": n.sender_id, "text": n.body, "language": n.language, "received_at": n.received_at.isoformat()} for n in db.query(RawNotification).order_by(RawNotification.received_at.desc()).all()]

@app.get("/api/repayments/calendar")
def calendar(db: Session = Depends(get_db)):
    return [{"id": c.id, "amount": c.amount, "due_date": c.due_date.isoformat(), "status": c.status, "lender": c.loan.lender_name, "loan_type": c.loan.loan_type} for c in active_cycles(db)]

@app.get("/api/financial/summary")
def financial_summary(db: Session = Depends(get_db)): return summary(db)

@app.post("/api/simulate")
def simulation(payload: SimulationIn, db: Session = Depends(get_db)): return simulate(db, payload.proposed_emi)

@app.post("/api/query/assistant")
def assistant(payload: QueryIn, db: Session = Depends(get_db)):
    cycle = active_cycles(db)[0] if active_cycles(db) else None
    if not cycle: return {"answer": "No pending repayments found."}
    if any(word in payload.query.lower() for word in ("meri", "agli", "kab", "when", "next")):
        return {"answer": f"Your next repayment is ₹{cycle.amount:,.0f} to {cycle.loan.lender_name} on {cycle.due_date.strftime('%d %B %Y')}."}
    return {"answer": f"I found {len(active_cycles(db))} pending repayments in your local graph."}
