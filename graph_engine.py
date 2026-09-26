from datetime import date, timedelta
from sqlalchemy.orm import Session
from dateutil import parser as date_parser

from models import LoanObligation, RepaymentCycle


def find_or_create_cycle(db: Session, parsed, notification_id: int, user_id: int | None = None):
    if not parsed.get("amount") or parsed.get("intent") == "NON_FINANCIAL":
        return None

    due = parsed.get("due_date")

    if isinstance(due, str):
        try:
            due = date_parser.parse(
                due,
                dayfirst=True
            ).date()
        except (ValueError, TypeError, OverflowError):
            due = date.today()

    elif due is None:
        due = date.today()

    lender_name = (
        parsed.get("lender_name")
        or parsed.get("sender")
        or "Unknown lender"
    )

    loan_query = db.query(LoanObligation).filter(
        LoanObligation.lender_name == lender_name,
        LoanObligation.monthly_emi == parsed["amount"]
    )
    if user_id is not None:
        loan_query = loan_query.filter(LoanObligation.user_id == user_id)
    loan = loan_query.first()

    if not loan:
        loan = LoanObligation(
            user_id=user_id,
            lender_name=lender_name,
            loan_type="Instant Loan",
            total_principal=parsed["amount"] * 12,
            monthly_emi=parsed["amount"],
            due_day_of_month=due.day,
            account_ref=parsed.get("sender")
        )

        db.add(loan)
        db.flush()

    cycle = db.query(RepaymentCycle).filter(
        RepaymentCycle.loan_id == loan.id,
        RepaymentCycle.due_date.between(
            due - timedelta(days=2),
            due + timedelta(days=2)
        )
    ).first()

    if not cycle:
        cycle = RepaymentCycle(
            loan_id=loan.id,
            amount=parsed["amount"],
            due_date=due,
            status=(
                "PAID"
                if parsed.get("intent") == "PAYMENT_DEBITED"
                else "PENDING"
            ),
            notification_source_id=notification_id
        )

        db.add(cycle)

    elif parsed.get("intent") == "PAYMENT_DEBITED":
        cycle.status = "PAID"

    return cycle


def active_cycles(db: Session, user_id: int | None = None):
    query = (
        db.query(RepaymentCycle)
        .join(LoanObligation)
        .filter(RepaymentCycle.status != "PAID")
    )
    if user_id is not None:
        query = query.filter(LoanObligation.user_id == user_id)
    return query.order_by(RepaymentCycle.due_date).all()
