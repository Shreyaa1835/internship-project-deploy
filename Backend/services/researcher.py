import os
import json
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_tavily import TavilySearch
from langchain_core.prompts import ChatPromptTemplate
from database.db import update_db_outline, get_db

load_dotenv()

def perform_research_and_outline(post_id: int, topic: str, keywords: str):
    print(f"--- 🚀 DEBUG START: Post {post_id} ---")
    try:
        # Step A: Validate Keys
        if not os.getenv("GOOGLE_API_KEY") or not os.getenv("TAVILY_API_KEY"):
            print("❌ ERROR: Missing API Keys in .env")
            raise ValueError("Missing API Keys")

        # Step B: Web Search - Limited to 2 results to save quota
        print("🔍 Step 1: Searching Tavily (Limited Results)...")
        search = TavilySearch()
        results = search.invoke({"query": f"{topic} {keywords}", "max_results": 2})
        print("✅ Step 1: Search Successful")

        # Step C: AI Outline
        print("🧠 Step 2: Calling Gemini...")
        llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash-lite")
        prompt = ChatPromptTemplate.from_template(
            "Topic: {topic}. Research: {data}. Create a blog outline in JSON format only. "
            "Structure: {{ \"sections\": [ {{ \"heading\": \"Title\", \"points\": [\"...\"] }} ] }}"
        )
        
        chain = prompt | llm
        response = chain.invoke({"topic": topic, "data": results})
        print("✅ Step 2: Gemini Successful")

        # FIX: Clean Markdown backticks from the content
        raw_content = response.content.strip()
        if raw_content.startswith("```json"):
            raw_content = raw_content.replace("```json", "", 1).replace("```", "", 1).strip()
        elif raw_content.startswith("```"):
            raw_content = raw_content.replace("```", "", 1).replace("```", "", 1).strip()

        # Step D: Save Clean JSON
        update_db_outline(post_id, raw_content)
        print(f"🎉 SUCCESS: Post {post_id} is complete!")

    except Exception as e:
        print(f"❌ CRITICAL ERROR: {str(e)}")
        db = get_db()
        try:
            db.execute("UPDATE blog_posts SET status = 'ERROR' WHERE id = ?", (post_id,))
            db.commit()
        finally:
            db.close()