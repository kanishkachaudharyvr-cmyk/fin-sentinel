from datetime import date, timedelta
from sqlalchemy.orm import Session
from models import LoanObligation, RepaymentCycle


def find_or_create_cycle(db: Session, parsed, notification_id: int):
    if not parsed.get("amount") or parsed.get("intent") == "NON_FINANCIAL":
        return None
    due = parsed.get("due_date") or date.today()
    loan = db.query(LoanObligation).filter(LoanObligation.lender_name == parsed["lender_name"], LoanObligation.monthly_emi == parsed["amount"]).first()
    if not loan:
        loan = LoanObligation(lender_name=parsed["lender_name"], loan_type="Instant Loan", total_principal=parsed["amount"] * 12, monthly_emi=parsed["amount"], due_day_of_month=due.day, account_ref=parsed["sender"])
        db.add(loan); db.flush()
    cycle = db.query(RepaymentCycle).filter(RepaymentCycle.loan_id == loan.id, RepaymentCycle.due_date.between(due - timedelta(days=2), due + timedelta(days=2))).first()
    if not cycle:
        cycle = RepaymentCycle(loan_id=loan.id, amount=parsed["amount"], due_date=due, status="PAID" if parsed["intent"] == "PAYMENT_DEBITED" else "PENDING", notification_source_id=notification_id)
        db.add(cycle)
    elif parsed["intent"] == "PAYMENT_DEBITED":
        cycle.status = "PAID"
    return cycle


def active_cycles(db: Session):
    return db.query(RepaymentCycle).join(LoanObligation).filter(RepaymentCycle.status != "PAID").order_by(RepaymentCycle.due_date).all()
