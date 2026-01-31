import os
from fastapi import FastAPI, BackgroundTasks, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from typing import Optional
from pydantic import BaseModel
import firebase_admin
from firebase_admin import auth as firebase_auth, credentials

# Import local modules
from database.db import create_blog_post, get_db, init_db, get_user_posts
from services.researcher import perform_research_and_outline
from services.writer import generate_blog_content

# --- FIREBASE INITIALIZATION ---
# Requirement: Initialize the SDK to meet 'authenticated user' criteria

# This logic calculates the exact path to the JSON file relative to main.py
base_dir = os.path.dirname(os.path.abspath(__file__))
# If your file is inside the Backend folder with main.py, use "serviceAccountKey.json"
# If it is in a subfolder, adjust accordingly.
cert_path = os.path.join(base_dir, "serviceAccountKey.json")

if not firebase_admin._apps:
    try:
        if os.path.exists(cert_path):
            cred = credentials.Certificate(cert_path)
            firebase_admin.initialize_app(cred)
            print(f"✅ Firebase Admin SDK initialized successfully at: {cert_path}")
        else:
            print(f"❌ Firebase Init Error: File not found at {cert_path}")
            print("Please ensure serviceAccountKey.json is in the same folder as main.py")
    except Exception as e:
        print(f"❌ Firebase Init Error: {e}")

# --- FIREBASE AUTH DEPENDENCY ---
# Requirement: Extract userId from Firebase token
async def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    
    token = authorization.split("Bearer ")[1]
    try:
        # Verify the token against Firebase servers
        decoded_token = firebase_auth.verify_id_token(token)
        return decoded_token['uid'] 
    except Exception as e:
        print(f"Auth Error: {e}")
        raise HTTPException(status_code=401, detail="Invalid Firebase token")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic: Initialize DB tables
    init_db()
    print("✅ Database initialized successfully.")
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BlogPostRequest(BaseModel):
    topic: str
    keywords: str

# --- ENDPOINTS ---

@app.post("/api/blog-posts")
async def create_post(
    request: BlogPostRequest, 
    background_tasks: BackgroundTasks,
    user_id: str = Depends(get_current_user) # Secure ID extraction
):
    """Creates a post entry and triggers AI research in the background."""
    try:
        # Use verified user_id from token
        post_id = create_blog_post(request.topic, request.keywords, user_id)
        
        # Trigger long-running background task
        background_tasks.add_task(
            perform_research_and_outline, 
            post_id, 
            request.topic, 
            request.keywords
        )
        
        return {"postId": post_id, "status": "RESEARCHING"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/blog-posts")
async def fetch_posts(user_id: str = Depends(get_current_user)): 
    # Requirement: Filter posts by authenticated user only
    try:
        posts = get_user_posts(user_id)
        return posts
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/blog-posts/{post_id}")
async def get_status(post_id: int, user_id: str = Depends(get_current_user)):
    db = get_db()
    try:
        # Verify ownership by checking against user_id extracted from token
        row = db.execute(
            "SELECT id, topic, status, outline, content FROM blog_posts WHERE id = ? AND user_id = ?", 
            (post_id, user_id)
        ).fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="Post not found")
        return dict(row) 
    finally:
        db.close()

@app.post("/api/blog-posts/{post_id}/generate")
async def trigger_generation(
    post_id: int, 
    background_tasks: BackgroundTasks,
    user_id: str = Depends(get_current_user)
):
    """Triggers the full content generation phase after outline approval."""
    db = get_db()
    try:
        # Verify ownership before generating
        post = db.execute("SELECT id FROM blog_posts WHERE id = ? AND user_id = ?", (post_id, user_id)).fetchone()
        
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")

        # Update status to 'WRITING'
        db.execute("UPDATE blog_posts SET status = 'WRITING' WHERE id = ?", (post_id,))
        db.commit()

        # Offload content generation to a background thread
        background_tasks.add_task(generate_blog_content, post_id)
        
        return {"message": "Generation started", "status": "WRITING"}
    finally:
        db.close()

@app.get("/api/blog-posts/{post_id}")
async def get_post_detail(post_id: int, current_user: dict = Depends(get_current_user)):
    """
    Retrieves a single blog post by ID for the authenticated user.
    """
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # Requirement: Verify the post belongs to the authenticated user
    cursor.execute(
        "SELECT * FROM blog_posts WHERE id = ? AND user_id = ?", 
        (post_id, current_user["uid"])
    )
    post = cursor.fetchone()
    conn.close()
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found or unauthorized")
    
    return dict(post)