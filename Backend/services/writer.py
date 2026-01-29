from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from database.db import update_db_content, get_post_for_generation

def generate_blog_content(post_id: int):
    try:
        post = get_post_for_generation(post_id)
        if not post or not post['outline']:
            raise ValueError("Outline data missing")

        llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash-lite")
        
        # Structuring the prompt for long-form content
        prompt = ChatPromptTemplate.from_template(
            "You are a professional blog writer. Topic: {topic}. "
            "Outline: {outline}. "
            "Task: Write a full, engaging blog post following this outline exactly. "
            "Use clear Markdown headings, write at least 2-3 paragraphs per section, "
            "and include an introduction and a compelling conclusion."
        )

        chain = prompt | llm
        response = chain.invoke({"topic": post['topic'], "outline": post['outline']})

        # Update the database with the final content
        update_db_content(post_id, response.content)
        print(f"✅ Success: Content generated for Post {post_id}")

    except Exception as e:
        print(f"❌ Generation Error: {str(e)}")
        # In a real app, you would update the DB status to 'ERROR' here