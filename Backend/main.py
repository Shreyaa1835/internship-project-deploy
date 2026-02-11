import os
import io
import re
import sqlite3
from fastapi import FastAPI, BackgroundTasks, HTTPException, Depends, Header, Request, Query
from fastapi.responses import Response , StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from pydantic import BaseModel
import firebase_admin
from firebase_admin import auth as firebase_auth, credentials
from typing import Optional
from fpdf import FPDF
import json

from database.db import (
    create_blog_post,
    get_db,
    init_db,
    get_user_posts
)
from services.researcher import perform_research_and_outline
from services.writer import generate_blog_content

from services.plagiarism import analyze_content_patterns  
from services.humanizer import humanize_full_content   

# ---------------- FIREBASE INIT ----------------
base_dir = os.path.dirname(os.path.abspath(__file__))
cert_path = os.path.join(base_dir, "serviceAccountKey.json")

if not firebase_admin._apps:
    firebase_json = os.environ.get("FIREBASE_CREDENTIALS")

    if firebase_json:
        # ✅ Production (Render)
        cred_dict = json.loads(firebase_json)
        cred = credentials.Certificate(cred_dict)
    else:
        # ✅ Local development
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
    allow_origins=["*"],
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

class ScheduleRequest(BaseModel):
    scheduledAt: str

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

def search_posts_in_db(query: str, user_id: str):
    db = get_db()
    try:
        search_term = f"%{query.lower()}%"
        cursor = db.execute(
            """
            SELECT * FROM blog_posts 
            WHERE user_id = ? 
            AND (LOWER(topic) LIKE ? OR LOWER(content) LIKE ?)
            ORDER BY id DESC
            """,
            (user_id, search_term, search_term)
        )
        rows = cursor.fetchall()
        return [dict(row) for row in rows]
    finally:
        db.close()

def update_scheduled_date(post_id: int, user_id: str, scheduled_at: str):
    db = get_db()
    try:
        db.execute(
            "UPDATE blog_posts SET scheduled_at = ?, status = 'Scheduled' WHERE id = ? AND user_id = ?",
            (scheduled_at, post_id, user_id)
        )
        db.commit()
    finally:
        db.close()

def clean_for_pdf(text: str) -> str:
    if not text:
        return ""

    replacements = {
        "\u2013": "-",   # en dash
        "\u2014": "-",   # em dash
        "\u2018": "'",   # left single quote
        "\u2019": "'",   # right single quote
        "\u201c": '"',   # left double quote
        "\u201d": '"',   # right double quote
        "\u2022": "*",   # bullet
    }

    for unicode_char, ascii_char in replacements.items():
        text = text.replace(unicode_char, ascii_char)

    # Ensure compatibility with FPDF (latin-1 only)
    return text.encode("latin-1", "ignore").decode("latin-1")


def format_post_content(post, format_type: str):
    title = post.get('topic', 'Untitled')
    content = post.get('content') or "No content available."

    format_type = format_type.lower()

    if format_type == "pdf":
        safe_title = clean_for_pdf(title)
        safe_content = clean_for_pdf(content)

        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", 'B', 16)
        pdf.cell(0, 10, safe_title, ln=True, align='C')
        pdf.ln(10)

        pdf.set_font("Arial", size=12)
        pdf.multi_cell(0, 10, safe_content)

        # ✅ CRITICAL FIX: convert string → bytes
        pdf_bytes = pdf.output(dest='S').encode('latin-1')
        buffer = io.BytesIO(pdf_bytes)
        buffer.seek(0)

        # ✅ Safe filename (no special characters)
        safe_filename = re.sub(r'[^a-zA-Z0-9_-]', '_', safe_title)

        return buffer, "application/pdf", f"{safe_filename}.pdf"

    elif format_type == "txt":
        text_body = f"TOPIC: {title}\n\n{content}"
        return text_body, "text/plain", f"{title}.txt"

    elif format_type == "markdown":
        markdown_body = f"# {title}\n\n{content}"
        return markdown_body, "text/markdown", f"{title}.md"

    else:
        html_body = f"""
        <html>
            <body>
                <h1>{title}</h1>
                <p>{content.replace('\n', '<br>')}</p>
            </body>
        </html>
        """
        return html_body, "text/html", f"{title}.html"
# ---------------------------------------------------------
# 1. STATIC ROUTES 
# ---------------------------------------------------------

@app.get("/api/blog-posts/search")
async def search_posts(
    query: str = "", 
    user_id: str = Depends(get_current_user)
):
    print(f"DEBUG: Search hit. Term: '{query}'")
    if not query.strip():
        return get_user_posts(user_id)
    return search_posts_in_db(query.strip(), user_id)

@app.get("/api/blog-posts")
async def fetch_posts(user_id: str = Depends(get_current_user)):
    return get_user_posts(user_id)

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

# ---------------------------------------------------------
# 2. DYNAMIC ID ROUTES 
# ---------------------------------------------------------

@app.put("/api/blog-posts/{post_id}/schedule")
async def schedule_blog_post(
    post_id: int, 
    request: ScheduleRequest, 
    user_id: str = Depends(get_current_user)
):
    update_scheduled_date(post_id, user_id, request.scheduledAt)
    return {"status": "success", "scheduledAt": request.scheduledAt}

@app.get("/api/blog-posts/{post_id}/export")
async def export_blog_post(
    post_id: int, 
    format: str = "markdown", 
    user_id: str = Depends(get_current_user)
):
    db = get_db()
    try:
        row = db.execute("SELECT * FROM blog_posts WHERE id = ? AND user_id = ?", (post_id, user_id)).fetchone()
        if not row: 
            raise HTTPException(status_code=404, detail="Post not found")
        
        formatted_content, media_type, filename = format_post_content(dict(row), format)

        if format.lower() == "pdf":
            return StreamingResponse(
                formatted_content,
                media_type=media_type,
                headers={"Content-Disposition": f"attachment; filename={filename}"}
            )
        else:
            return Response(
                content=formatted_content, 
                media_type=media_type, 
                headers={"Content-Disposition": f"attachment; filename={filename}"}
            )
    finally: 
        db.close()

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

@app.post("/api/blog-posts/{post_id}/check-plagiarism")
async def check_plagiarism(
    post_id: int,
    user_id: str = Depends(get_current_user)
):
    db = get_db()
    try:
        row = db.execute(
            "SELECT content FROM blog_posts WHERE id=? AND user_id=?",
            (post_id, user_id)
        ).fetchone()

        if not row or not row["content"]:
            raise HTTPException(status_code=404, detail="Content not found")

        result = await analyze_content_patterns(row["content"])
        return result

    finally:
        db.close()


@app.post("/api/blog-posts/{post_id}/humanize")
async def humanize_post(post_id: int, request: Request, user_id: str = Depends(get_current_user)):
    try:
        payload = await request.json()
    except:
        raise HTTPException(status_code=400, detail="Invalid JSON")

    user_prompt = payload.get("user_prompt", "") 
    tone = payload.get("tone", "balanced")

    db = get_db()
    try:
        row = db.execute("SELECT content FROM blog_posts WHERE id=? AND user_id=?", (post_id, user_id)).fetchone()
        if not row or not row["content"]:
            raise HTTPException(status_code=404, detail="Content not found")
            
        rewritten = await humanize_full_content(row["content"], user_prompt, tone)
        return rewritten
    finally:
        db.close()
