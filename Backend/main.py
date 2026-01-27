from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from database.db import get_db
from models.blog_post import create_blog_posts_table

app = FastAPI()

create_blog_posts_table()

class BlogPostRequest(BaseModel):
    topic: str
    keywords: str
    userId: str

def create_blog_post(topic, keywords, user_id):
    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
        INSERT INTO blog_posts (topic, keywords, status, user_id)
        VALUES (?, ?, ?, ?)
    """, (topic, keywords, "OUTLINE_GENERATING", user_id))

    db.commit()
    post_id = cursor.lastrowid
    db.close()

    return post_id

@app.post("/api/blog-posts")
def create_post(data: BlogPostRequest):
    if not data.topic or not data.keywords:
        raise HTTPException(status_code=400, detail="Topic and keywords are required")

    post_id = create_blog_post(
        data.topic,
        data.keywords,
        data.userId
    )

    return {
        "postId": post_id,
        "status": "OUTLINE_GENERATING"
    }
