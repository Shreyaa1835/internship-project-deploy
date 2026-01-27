from database.db import get_db

def create_blog_posts_table():
    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS blog_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        topic TEXT NOT NULL,
        keywords TEXT NOT NULL,
        outline TEXT,
        status TEXT NOT NULL,
        user_id TEXT NOT NULL
    )
    """)

    db.commit()
    db.close()
