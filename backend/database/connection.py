import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DB_DIR = os.environ.get("DATABASE_DIR", os.path.join(BASE_DIR, "data"))
DB_PATH = os.environ.get("DATABASE_PATH", os.path.join(DB_DIR, "app.db"))


def _ensure_dir() -> None:
    os.makedirs(DB_DIR, exist_ok=True)


def get_connection() -> sqlite3.Connection:
    _ensure_dir()
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_db() -> None:
    conn = get_connection()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS entries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            category TEXT,
            amount REAL,
            time TEXT,
            title TEXT,
            remind_time TEXT,
            repeat_type TEXT DEFAULT 'none',
            source TEXT,
            note TEXT
        )
        """
    )
    conn.commit()
    conn.close()
