import sqlite3

DB_NAME = "blog_posts.db"

def get_db():
    # timeout prevents "database is locked" during concurrent polling/writing
    conn = sqlite3.connect(DB_NAME, timeout=20)
    conn.row_factory = sqlite3.Row
    return conn

def create_blog_posts_table():
    db = get_db()
    try:
        cursor = db.cursor()
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS blog_posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            topic TEXT NOT NULL,
            keywords TEXT NOT NULL,
            outline TEXT,
            status TEXT NOT NULL,
            user_id TEXT
        )
        """)
        db.commit()
    finally:
        db.close() #

def create_blog_post(topic: str, keywords: str, user_id: str = None) -> int:
    db = get_db()
    try:
        cursor = db.cursor()
        cursor.execute(
            "INSERT INTO blog_posts (topic, keywords, status, user_id) VALUES (?, ?, ?, ?)",
            (topic, keywords, "RESEARCHING", user_id)
        )
        db.commit()
        return cursor.lastrowid
    finally:
        db.close()

def update_db_outline(post_id: int, outline_json: str):
    db = get_db()
    try:
        cursor = db.cursor()
        cursor.execute(
            "UPDATE blog_posts SET outline = ?, status = 'OUTLINE_READY' WHERE id = ?",
            (outline_json, post_id)
        )
        db.commit()
    finally:
        db.close()