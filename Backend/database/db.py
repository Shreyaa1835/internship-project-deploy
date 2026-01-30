import sqlite3

DB_NAME = "blog_posts.db"

def get_db():
    # timeout prevents "database is locked" during concurrent polling/writing
    conn = sqlite3.connect(DB_NAME, timeout=20)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialises the database with the full schema required for content generation."""
    db = get_db()
    try:
        # Added 'content' to store the full AI post and 'created_at' for sorting
        db.execute('''
            CREATE TABLE IF NOT EXISTS blog_posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                topic TEXT NOT NULL,
                keywords TEXT NOT NULL,
                outline TEXT,
                content TEXT, 
                status TEXT DEFAULT 'RESEARCHING',
                user_id TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        db.commit()
    finally:
        db.close()

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

def get_post_for_generation(post_id: int):
    db = get_db()
    # Retrieve both topic and outline for better context
    post = db.execute(
        "SELECT topic, outline FROM blog_posts WHERE id = ?", 
        (post_id,)
    ).fetchone()
    db.close()
    return post

def update_db_content(post_id: int, generated_text: str):
    """Saves the full AI-generated blog post and updates status to Published"""
    db = get_db()
    try:
        db.execute(
            "UPDATE blog_posts SET content = ?, status = 'Published' WHERE id = ?",
            (generated_text, post_id)
        )
        db.commit()
    finally:
        db.close()

def get_user_posts(user_id: str):
    db = get_db()
    try:
        # Use * to see if it works without specific column naming first
        cursor = db.execute(
            "SELECT * FROM blog_posts WHERE user_id = ? ORDER BY id DESC", 
            (user_id,)
        )
        rows = cursor.fetchall()
        return [dict(row) for row in rows]
    except Exception as e:
        print(f"💥 SQL ERROR: {e}")
        return []
    finally:
        db.close()