from contextlib import asynccontextmanager
from typing import Optional
from pydantic import BaseModel
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Import local modules
from database.db import create_blog_post, get_db, init_db
from services.researcher import perform_research_and_outline
from services.writer import generate_blog_content

# --- LIFESPAN MANAGEMENT ---
# Recommended way to handle startup/shutdown logic
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic: Initialize DB tables
    init_db()
    print("✅ Database initialized successfully.")
    yield
    # Shutdown logic: Close resources here if needed

app = FastAPI(lifespan=lifespan)

# --- MIDDLEWARE ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- SCHEMAS ---
class BlogPostRequest(BaseModel):
    topic: str
    keywords: str
    user_id: Optional[str] = None

# --- ENDPOINTS ---

@app.post("/api/blog-posts")
async def create_post(request: BlogPostRequest, background_tasks: BackgroundTasks):
    """Creates a post entry and triggers AI research in the background."""
    try:
        # 1. Create entry in DB
        post_id = create_blog_post(request.topic, request.keywords, request.user_id)
        
        # 2. Trigger long-running background task
        print(f"🚀 Triggering AI Research for Post ID: {post_id}")
        background_tasks.add_task(
            perform_research_and_outline, 
            post_id, 
            request.topic, 
            request.keywords
        )
        
        return {"postId": post_id, "status": "RESEARCHING"}
    except Exception as e:
        print(f"❌ POST Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/blog-posts/{post_id}")
async def get_status(post_id: int):
    db = get_db()
    try:
        # We MUST include 'content' in the SELECT statement
        row = db.execute(
            "SELECT id, topic, status, outline, content FROM blog_posts WHERE id = ?", 
            (post_id,)
        ).fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="Post not found")
            
        # Convert row to dictionary
        return dict(row) 
    finally:
        db.close()

@app.post("/api/blog-posts/{post_id}/generate")
async def trigger_generation(post_id: int, background_tasks: BackgroundTasks):
    """Triggers the full content generation phase after outline approval."""
    db = get_db()
    try:
        post = db.execute("SELECT id FROM blog_posts WHERE id = ?", (post_id,)).fetchone()
        
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")

        # Update status to 'WRITING' to provide immediate feedback to the UI
        db.execute("UPDATE blog_posts SET status = 'WRITING' WHERE id = ?", (post_id,))
        db.commit()

        # Offload content generation to a background thread
        background_tasks.add_task(generate_blog_content, post_id)
        
        return {"message": "Generation started", "status": "WRITING"}
    finally:
        db.close()