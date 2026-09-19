from datetime import datetime
from sqlalchemy import Column, Date, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from database import Base

class RawNotification(Base):
    __tablename__ = "raw_notifications"
    id = Column(Integer, primary_key=True)
    sender_id = Column(String(120), nullable=False)
    body = Column(Text, nullable=False)
    received_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    language = Column(String(32), default="English")
    status = Column(String(24), default="UNPROCESSED")
    cycles = relationship("RepaymentCycle", back_populates="notification")

class LoanObligation(Base):
    __tablename__ = "loan_obligations"
    id = Column(Integer, primary_key=True)
    lender_name = Column(String(120), nullable=False)
    loan_type = Column(String(60), nullable=False)
    total_principal = Column(Float, default=0)
    monthly_emi = Column(Float, nullable=False)
    due_day_of_month = Column(Integer, nullable=False)
    account_ref = Column(String(120), default="")
    cycles = relationship("RepaymentCycle", back_populates="loan", cascade="all, delete-orphan")

class RepaymentCycle(Base):
    __tablename__ = "repayment_cycles"
    id = Column(Integer, primary_key=True)
    loan_id = Column(Integer, ForeignKey("loan_obligations.id"), nullable=False)
    amount = Column(Float, nullable=False)
    due_date = Column(Date, nullable=False)
    status = Column(String(24), default="PENDING")
    notification_source_id = Column(Integer, ForeignKey("raw_notifications.id"), nullable=True)
    loan = relationship("LoanObligation", back_populates="cycles")
    notification = relationship("RawNotification", back_populates="cycles")

class UserProfile(Base):
    __tablename__ = "user_profiles"
    id = Column(Integer, primary_key=True)
    monthly_income = Column(Float, default=35000)
    dti_threshold = Column(Float, default=40.0)
