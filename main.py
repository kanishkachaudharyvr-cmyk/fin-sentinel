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
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
init_db()

class NotificationIn(BaseModel): sender: str; text: str
class SimulationIn(BaseModel): proposed_amount: float = 0; proposed_emi: float
class QueryIn(BaseModel): query: str

@app.get("/api/health")
def health(): return {"ok": True}

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
