from fastapi import FastAPI, BackgroundTasks, HTTPException
from pydantic import BaseModel
from typing import Optional
from database.db import create_blog_post, get_db, create_blog_posts_table
from services.researcher import perform_research_and_outline
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    create_blog_posts_table()

class BlogPostRequest(BaseModel):
    topic: str
    keywords: str
    user_id: Optional[str] = None

@app.post("/api/blog-posts")
async def create_post(request: BlogPostRequest, background_tasks: BackgroundTasks):
    try:
        # 1. Create entry in DB
        post_id = create_blog_post(request.topic, request.keywords, request.user_id)
        
        # 2. Trigger background task
        print(f"🚀 Triggering AI Research for Post ID: {post_id}")
        background_tasks.add_task(perform_research_and_outline, post_id, request.topic, request.keywords)
        
        return {"postId": post_id, "status": "RESEARCHING"}
    except Exception as e:
        print(f"❌ POST Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/blog-posts/{post_id}")
async def get_status(post_id: int):
    db = get_db()
    try:
        # Check if record exists
        row = db.execute("SELECT status, outline FROM blog_posts WHERE id = ?", (post_id,)).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Not found")
        return {"status": row["status"], "outline": row["outline"]}
    finally:
        db.close()