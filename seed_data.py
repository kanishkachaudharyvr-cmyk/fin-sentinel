from datetime import date
from database import SessionLocal, init_db
from models import LoanObligation, RawNotification, RepaymentCycle, UserProfile

init_db(); db = SessionLocal(); db.query(RepaymentCycle).delete(); db.query(LoanObligation).delete(); db.query(RawNotification).delete(); db.query(UserProfile).delete()
db.add(UserProfile(monthly_income=35000, dti_threshold=40.0))
items = [("LazyPay", "BNPL", 1500, 12, "VK-LAZYPY", "Your LazyPay EMI of ₹1,500 is due on 12 June."), ("Amazon Pay", "Device EMI", 2500, 18, "AMZPAY", "Amazon Pay EMI ₹2,500 due on 18 June."), ("KreditBee", "Instant Loan", 3000, 24, "AD-KREDIT", "आपकी KreditBee EMI ₹3,000 24 जून को देय है।"), ("Shopping EMI", "Shopping EMI", 3500, 5, "HDFCBK", "Your shopping EMI of ₹3,500 is due on 5 June.")]
for lender, kind, amount, day, sender, body in items:
    note = RawNotification(sender_id=sender, body=body, language="Hindi" if "आपकी" in body else "English", status="PROCESSED"); db.add(note); db.flush()
    loan = LoanObligation(lender_name=lender, loan_type=kind, total_principal=amount*12, monthly_emi=amount, due_day_of_month=day, account_ref=sender); db.add(loan); db.flush()
    db.add(RepaymentCycle(loan_id=loan.id, amount=amount, due_date=date(2026, 6, day), status="PENDING", notification_source_id=note.id))
db.commit(); db.close(); print("Seeded sentinel.db")
