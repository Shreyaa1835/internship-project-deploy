import os
import sqlite3
from fastapi import FastAPI, BackgroundTasks, HTTPException, Depends, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from pydantic import BaseModel
import firebase_admin
from firebase_admin import auth as firebase_auth, credentials

from database.db import (
    create_blog_post,
    get_db,
    init_db,
    get_user_posts
)
from services.researcher import perform_research_and_outline
from services.writer import generate_blog_content

# --- IMPORT NEW MODULAR SERVICES ---
from services.plagiarism import analyze_content_patterns  # LLM-1
from services.humanizer import humanize_full_content   # LLM-2

# ---------------- FIREBASE INIT ----------------
base_dir = os.path.dirname(os.path.abspath(__file__))
cert_path = os.path.join(base_dir, "serviceAccountKey.json")

if not firebase_admin._apps:
    cred = credentials.Certificate(cert_path)
    firebase_admin.initialize_app(cred)

# ---------------- AUTH DEPENDENCY ----------------
async def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")

    token = authorization.split("Bearer ")[1]
    decoded = firebase_auth.verify_id_token(token)
    return decoded["uid"]

# ---------------- APP INIT ----------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- SCHEMAS ----------------
class BlogPostRequest(BaseModel):
    topic: str
    keywords: str

class UpdatePostRequest(BaseModel):
    topic: str
    content: str

# ---------------- HELPERS ----------------
def update_blog_post(post_id: int, user_id: str, topic: str, content: str):
    db = get_db()
    try:
        post = db.execute(
            "SELECT id FROM blog_posts WHERE id = ? AND user_id = ?",
            (post_id, user_id)
        ).fetchone()

        if not post:
            raise HTTPException(status_code=404, detail="Post not found")

        db.execute(
            """
            UPDATE blog_posts
            SET topic = ?, content = ?, status = 'UPDATED'
            WHERE id = ?
            """,
            (topic, content, post_id)
        )
        db.commit()

        updated = db.execute(
            "SELECT * FROM blog_posts WHERE id = ?",
            (post_id,)
        ).fetchone()

        return dict(updated)
    finally:
        db.close()

# ---------------- ROUTES ----------------
@app.post("/api/blog-posts")
async def create_post(
    request: BlogPostRequest,
    background_tasks: BackgroundTasks,
    user_id: str = Depends(get_current_user)
):
    post_id = create_blog_post(request.topic, request.keywords, user_id)
    background_tasks.add_task(
        perform_research_and_outline,
        post_id,
        request.topic,
        request.keywords
    )
    return {"postId": post_id, "status": "RESEARCHING"}

@app.get("/api/blog-posts")
async def fetch_posts(user_id: str = Depends(get_current_user)):
    return get_user_posts(user_id)

@app.get("/api/blog-posts/{post_id}")
async def get_post(post_id: int, user_id: str = Depends(get_current_user)):
    db = get_db()
    try:
        row = db.execute(
            "SELECT * FROM blog_posts WHERE id = ? AND user_id = ?",
            (post_id, user_id)
        ).fetchone()

        if not row:
            raise HTTPException(status_code=404, detail="Post not found")

        return dict(row)
    finally:
        db.close()

@app.put("/api/blog-posts/{post_id}")
async def update_post(
    post_id: int,
    request: UpdatePostRequest,
    user_id: str = Depends(get_current_user)
):
    if not request.topic or not request.content:
        raise HTTPException(status_code=400, detail="Invalid data")

    return update_blog_post(
        post_id,
        user_id,
        request.topic,
        request.content
    )

@app.post("/api/blog-posts/{post_id}/generate")
async def generate(
    post_id: int,
    background_tasks: BackgroundTasks,
    user_id: str = Depends(get_current_user)
):
    db = get_db()
    try:
        post = db.execute(
            "SELECT id FROM blog_posts WHERE id = ? AND user_id = ?",
            (post_id, user_id)
        ).fetchone()

        if not post:
            raise HTTPException(status_code=404, detail="Post not found")

        db.execute("UPDATE blog_posts SET status='WRITING' WHERE id=?", (post_id,))
        db.commit()

        background_tasks.add_task(generate_blog_content, post_id)
        return {"status": "WRITING"}
    finally:
        db.close()

@app.delete("/api/blog-posts/{post_id}")
async def delete_post(
    post_id: int, 
    user_id: str = Depends(get_current_user)
):
    db = get_db()
    try:
        post = db.execute(
            "SELECT id FROM blog_posts WHERE id = ? AND user_id = ?",
            (post_id, user_id)
        ).fetchone()

        if not post:
            raise HTTPException(status_code=404, detail="Post not found or unauthorized")

        db.execute("DELETE FROM blog_posts WHERE id = ?", (post_id,))
        db.commit()

        return {"status": "success", "message": "Post permanently removed"}
    finally:
        db.close()

#---------------- Plagiarism Analysis ----------------
@app.post("/api/blog-posts/{post_id}/check-plagiarism")
async def check_plagiarism(post_id: int, user_id: str = Depends(get_current_user)):
    db = get_db()
    try:
        row = db.execute("SELECT content FROM blog_posts WHERE id=? AND user_id=?", (post_id, user_id)).fetchone()
        if not row or not row["content"]:
            raise HTTPException(status_code=404, detail="Content not found")
        result = await analyze_content_patterns(row["content"])
        return result
    finally:
        db.close()

# ---------------- Humanized Rewrite ----------------
# main.py
@app.post("/api/blog-posts/{post_id}/humanize")
async def humanize_post(post_id: int, request: Request, user_id: str = Depends(get_current_user)):
    try:
        payload = await request.json()
    except:
        raise HTTPException(status_code=400, detail="Invalid JSON")

    # FRONTEND SENDS 'user_prompt' -> BACKEND READS 'user_prompt'
    user_prompt = payload.get("user_prompt", "") 
    tone = payload.get("tone", "balanced")

    db = get_db()
    try:
        row = db.execute("SELECT content FROM blog_posts WHERE id=? AND user_id=?", (post_id, user_id)).fetchone()
        if not row or not row["content"]:
            raise HTTPException(status_code=404, detail="Content not found")
            
        # Call the humanizer service
        rewritten = await humanize_full_content(row["content"], user_prompt, tone)
        
        # Rewritten contains {'rewritten_content': '...'}
        return rewritten
    finally:
        db.close()