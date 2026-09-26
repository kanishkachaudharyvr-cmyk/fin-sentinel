from sqlalchemy import create_engine, event, text
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "sqlite:///./sentinel.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})


@event.listens_for(engine, "connect")
def set_sqlite_pragmas(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA journal_mode=WAL")
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _table_columns(table: str) -> set[str]:
    with engine.connect() as conn:
        rows = conn.execute(text(f"PRAGMA table_info({table})")).fetchall()
    return {row[1] for row in rows}


def _table_exists(table: str) -> bool:
    with engine.connect() as conn:
        row = conn.execute(
            text("SELECT name FROM sqlite_master WHERE type='table' AND name=:name"),
            {"name": table},
        ).fetchone()
    return row is not None


def _add_column(table: str, column_sql: str) -> None:
    name = column_sql.split()[0]
    if not _table_exists(table):
        return
    if name in _table_columns(table):
        return
    with engine.begin() as conn:
        conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {column_sql}"))


def _backfill_financial_flags() -> None:
    if not _table_exists("device_notifications"):
        return
    with engine.begin() as conn:
        conn.execute(
            text(
                "UPDATE device_notifications SET is_financial = 1 "
                "WHERE is_emi = 1 AND COALESCE(is_financial, 0) = 0"
            )
        )


def migrate_schema() -> None:
    _add_column("raw_notifications", "user_id INTEGER")
    _add_column("loan_obligations", "user_id INTEGER")
    _add_column("device_notifications", "user_id INTEGER")
    _add_column("device_notifications", "is_financial INTEGER DEFAULT 0")
    _add_column("device_notifications", "cleared_at DATETIME")
    _add_column("device_connections", "active_user_id INTEGER")


def init_db():
    import models  # noqa: F401
    Base.metadata.create_all(bind=engine)
    migrate_schema()
    _backfill_financial_flags()
