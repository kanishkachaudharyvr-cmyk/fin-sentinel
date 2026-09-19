from datetime import date, timedelta
from sqlalchemy.orm import Session
from graph_engine import active_cycles
from models import UserProfile


def profile(db: Session):
    value = db.query(UserProfile).first()
    if not value:
        value = UserProfile(monthly_income=35000, dti_threshold=40.0); db.add(value); db.commit()
    return value


def summary(db: Session):
    user = profile(db); cycles = active_cycles(db); commitments = sum(c.amount for c in cycles)
    dti = commitments / user.monthly_income * 100 if user.monthly_income else 0
    return {"monthly_income": user.monthly_income, "total_existing_commitments": commitments, "current_dti": round(dti, 2), "risk_status": "AT_RISK" if dti > user.dti_threshold else "HEALTHY", "dti_threshold": user.dti_threshold}


def simulate(db: Session, proposed_emi: float):
    user = profile(db); base = summary(db); projected = (base["total_existing_commitments"] + proposed_emi) / user.monthly_income * 100
    dates = sorted(c.due_date for c in active_cycles(db))
    clustered = any(sum(1 for d in dates if start <= d <= start + timedelta(days=7)) >= 3 for start in dates)
    reasons = []
    if projected > user.dti_threshold: reasons.append(f"Projected DTI {projected:.1f}% exceeds {user.dti_threshold:.1f}% by {projected-user.dti_threshold:.1f} points.")
    if clustered: reasons.append("Three or more repayments fall within a rolling seven-day window.")
    return {"projected_dti": round(projected, 2), "threshold_delta": round(projected - user.dti_threshold, 2), "warning_reasons": reasons, "risk_status": "AT_RISK" if reasons else "HEALTHY"}
