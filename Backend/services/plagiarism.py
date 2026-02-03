import os, json, re
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate

load_dotenv()

llm_checker = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash-lite", 
    temperature=0,
    google_api_key=os.getenv("plag_key")
)

async def analyze_content_patterns(content: str):
    """Stage 1: Calibrated Neural Pattern Analysis."""
    template = """
    Evaluate the following manuscript for AI-pattern similarity and Originality.
    
    SCORING CALIBRATION:
    - 80-100%: Contains robotic hooks ('At its core'), formulaic summaries ('In conclusion'), and lacks first-person 'I/My' perspective.
    - 30-70%: Informative but standard structural flow.
    - 0-25%: High presence of personal anecdotes, non-linear thoughts, and informal human transitions.
    
    CRITICAL: If the text avoids generic AI transitions and uses a distinct personal voice, you MUST award a score below 25%.

    Return JSON only:
    {{
      "overall_similarity_score": <int>,
      "risk_level": "low | medium | high",
      "analysis_summary": "Identify if specific AI markers were removed or if personal anecdotes were added."
    }}

    Content: {content}
    """
    
    prompt = PromptTemplate(template=template, input_variables=["content"])
    chain = prompt | llm_checker

    try:
        response = await chain.ainvoke({"content": content})
        raw_text = getattr(response, "content", "")
        clean_json = re.sub(r'```json|```', '', raw_text).strip()
        return json.loads(clean_json)
    except Exception as e:
        return {"overall_similarity_score": 0, "risk_level": "low", "analysis_summary": f"Scan Error: {str(e)}"}