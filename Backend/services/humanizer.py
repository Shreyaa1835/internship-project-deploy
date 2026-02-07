import os, json, re
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()


llm_rewriter = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash-lite",
    temperature=0.85, 
    google_api_key=os.getenv("humanizer_key")
)

async def humanize_full_content(content: str, user_context: str = "", tone: str = "balanced"):
    """
    Stage 2: Full Content Refinement.
    Targets and removes 'AI-markers' identified in the scan verdict.
    """
    user_prompt = f"""
    You are an AI Content Humanizer. Your mission is to rewrite the blog post below to achieve a Similarity Index of less than 20%.
    
    STRATEGIC REWRITE RULES:
    1. DESTROY AI TRANSITIONS: Do NOT use 'At its core', 'In conclusion', 'Central to', 'The transformative power', or 'As we navigate'. Remove them entirely.
    2. INJECT PERSONALITY: Start sentences with first-person observations (e.g., "I noticed that...", "In my own workflow...", "What surprised me was...").
    3. BREAK LOGICAL SYMMETRY: AI is too balanced. Use short, punchy sentences followed by descriptive ones. Use informal contractions.
    4. USER SPECIFICS: Incorporate this context immediately: {user_context}

    TARGET TONE: {tone}

    ORIGINAL CONTENT:
    {content}

    OUTPUT JSON ONLY:
    {{
        "rewritten_content": "<human_version_here>"
    }}
    """
    try:
        response = await llm_rewriter.ainvoke(user_prompt)
        raw_text = getattr(response, "content", "")
        clean_json = re.sub(r'```json|```', '', raw_text).strip()
        data = json.loads(clean_json)
        return data
    except Exception as e:
        return {"rewritten_content": "", "error": str(e)}