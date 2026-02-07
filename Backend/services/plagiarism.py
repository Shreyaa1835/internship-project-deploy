import os
import json
import re
from dotenv import load_dotenv
from fastapi import HTTPException
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate

load_dotenv()

llm_checker = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash-lite",
    temperature=0.2,  
    google_api_key=os.getenv("plag_key")
)

async def analyze_content_patterns(content: str):
    """Plagiarism Scanner – PromptTemplate Safe"""

    template = """
Evaluate the following manuscript for AI-pattern similarity and originality.

SCORING RULES (STRICT):
- Return an INTEGER from 0 to 100
- Do NOT include % symbol
- Do NOT include text outside JSON

Return ONLY valid JSON in this exact format:
{{
  "overall_similarity_score": 0,
  "risk_level": "low | medium | high",
  "analysis_summary": "short explanation"
}}

Content:
{content}
"""

    prompt = PromptTemplate(
        template=template,
        input_variables=["content"]
    )

    chain = prompt | llm_checker

    response = await chain.ainvoke({"content": content})
    raw = getattr(response, "content", "").strip()

    print("\n====== RAW GEMINI OUTPUT ======")
    print(raw)
    print("================================\n")

    try:
        match = re.search(r"\{[\s\S]*\}", raw)
        if not match:
            raise ValueError("No JSON found in AI response")

        data = json.loads(match.group())

        if "overall_similarity_score" not in data:
            raise KeyError("overall_similarity_score missing")

        score = int(data["overall_similarity_score"])
        score = max(0, min(100, score))

        return {
            "overall_similarity_score": score,
            "risk_level": data.get("risk_level", "low"),
            "analysis_summary": data.get("analysis_summary", "")
        }

    except Exception as e:
        print("\n❌ PLAGIARISM SCAN ERROR ❌")
        print("ERROR:", e)
        print("RAW OUTPUT:", raw)

        raise HTTPException(
            status_code=500,
            detail="Plagiarism scan failed – see backend logs"
        )
