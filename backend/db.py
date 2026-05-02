import sqlite3
import os

# In production (Railway), set DATABASE_PATH to a path inside a mounted
# persistent volume, e.g. /data/golf.db.  Defaults to the local file.
DB_PATH = os.environ.get(
    'DATABASE_PATH',
    os.path.join(os.path.dirname(__file__), 'golf.db')
)
SCHEMA_PATH = os.path.join(os.path.dirname(__file__), 'schema.sql')
SEED_PATH = os.path.join(os.path.dirname(__file__), 'seed.sql')


def get_db(transaction_mode='DEFERRED'):
    """
    SQLite transaction isolation modes:
      'DEFERRED'  – default; no lock acquired until first read/write. Safe for
                    read-only endpoints; multiple readers can proceed concurrently.
      'IMMEDIATE' – acquires a write-reservation lock at BEGIN. Used for any
                    endpoint that issues INSERT/UPDATE/DELETE so that two concurrent
                    writes cannot interleave and corrupt related rows (e.g. a Visit
                    row and its 9 ConditionRatings rows must be written atomically).
      'EXCLUSIVE' – blocks all other connections, including readers. Reserved for
                    bulk administrative operations.
    """
    conn = sqlite3.connect(DB_PATH, isolation_level=transaction_mode)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    db_exists = os.path.exists(DB_PATH)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    with open(SCHEMA_PATH, 'r') as f:
        conn.executescript(f.read())
    if not db_exists:
        with open(SEED_PATH, 'r') as f:
            conn.executescript(f.read())
    conn.close()
