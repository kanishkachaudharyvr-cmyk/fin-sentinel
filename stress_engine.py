from datetime import date, timedelta
from sqlalchemy.orm import Session
from graph_engine import active_cycles
from models import FinancialProfile


def profile_for_user(db: Session, user_id: int):
    value = db.query(FinancialProfile).filter(FinancialProfile.user_id == user_id).first()
    if not value:
        value = FinancialProfile(
            user_id=user_id,
            monthly_income=0,
            monthly_expenses=0,
            savings=0,
            dti_threshold=40.0,
            onboarding_completed=0,
        )
        db.add(value)
        db.commit()
        db.refresh(value)
    return value


def summary(db: Session, user_id: int):
    user = profile_for_user(db, user_id)
    cycles = active_cycles(db, user_id)
    commitments = sum(c.amount for c in cycles)
    income = user.monthly_income or 0
    dti = commitments / income * 100 if income else 0
    return {
        "monthly_income": user.monthly_income or 0,
        "monthly_expenses": user.monthly_expenses or 0,
        "savings": user.savings or 0,
        "total_existing_commitments": commitments,
        "current_dti": round(dti, 2),
        "risk_status": "AT_RISK" if income and dti > user.dti_threshold else "HEALTHY",
        "dti_threshold": user.dti_threshold,
        "onboarding_completed": bool(user.onboarding_completed),
        "repayment_count": len(cycles),
    }


def simulate(db: Session, proposed_emi: float, user_id: int):
    user = profile_for_user(db, user_id)
    base = summary(db, user_id)
    income = user.monthly_income or 0
    projected = (base["total_existing_commitments"] + proposed_emi) / income * 100 if income else 0
    dates = sorted(c.due_date for c in active_cycles(db, user_id))
    clustered = any(sum(1 for d in dates if start <= d <= start + timedelta(days=7)) >= 3 for start in dates)
    reasons = []
    if income and projected > user.dti_threshold:
        reasons.append(
            f"Projected DTI {projected:.1f}% exceeds {user.dti_threshold:.1f}% by {projected-user.dti_threshold:.1f} points."
        )
    if clustered:
        reasons.append("Three or more repayments fall within a rolling seven-day window.")
    return {
        "projected_dti": round(projected, 2),
        "threshold_delta": round(projected - user.dti_threshold, 2) if income else 0,
        "warning_reasons": reasons,
        "risk_status": "AT_RISK" if reasons else "HEALTHY",
    }
