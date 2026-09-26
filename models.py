from datetime import datetime
from sqlalchemy import Column, Date, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String(120), nullable=False)
    email = Column(String(180), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    profile = relationship("FinancialProfile", back_populates="user", uselist=False)
    sessions = relationship("AuthSession", back_populates="user", cascade="all, delete-orphan")


class AuthSession(Base):
    __tablename__ = "auth_sessions"
    token = Column(String(80), primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    user = relationship("User", back_populates="sessions")


class FinancialProfile(Base):
    __tablename__ = "financial_profiles"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    monthly_income = Column(Float, default=0)
    monthly_expenses = Column(Float, default=0)
    savings = Column(Float, default=0)
    dti_threshold = Column(Float, default=40.0)
    onboarding_completed = Column(Integer, default=0)
    updated_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    user = relationship("User", back_populates="profile")


class RawNotification(Base):
    __tablename__ = "raw_notifications"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    sender_id = Column(String(120), nullable=False)
    body = Column(Text, nullable=False)
    received_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    language = Column(String(32), default="English")
    status = Column(String(24), default="UNPROCESSED")
    cycles = relationship("RepaymentCycle", back_populates="notification")


class LoanObligation(Base):
    __tablename__ = "loan_obligations"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
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
    monthly_income = Column(Float, default=0)
    dti_threshold = Column(Float, default=40.0)


class DeviceNotification(Base):
    __tablename__ = "device_notifications"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    source_app = Column(String(120), nullable=True)
    package_name = Column(String(120), nullable=True)
    title = Column(String(255), nullable=True)
    notification_text = Column(Text, nullable=True)
    is_emi = Column(Integer, default=0)
    is_financial = Column(Integer, default=0)
    amount = Column(Float, nullable=True)
    due_date = Column(String(60), nullable=True)
    detected_at = Column(String(60), nullable=True)
    received_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    data_source = Column(String(60), default="LIVE_DEVICE_DATA")
    cleared_at = Column(DateTime, nullable=True)


class DeviceConnection(Base):
    __tablename__ = "device_connections"
    id = Column(Integer, primary_key=True)
    last_heartbeat = Column(DateTime, default=datetime.utcnow, nullable=False)
    active_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
