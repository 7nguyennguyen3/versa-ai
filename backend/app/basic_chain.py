from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
import logging

async def generate_chat_title(user_message: str) -> str:
    try:
        title_prompt = ChatPromptTemplate.from_template(
            """Generate a formal and concise title (3-6 words) for a professional chat session.
            The title should reflect the initial message's intent without being too casual.
            Initial message: {message}
            Respond only with the title, no additional text."""
        )
        
        llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.3)  
        chain = title_prompt | llm
        response = await chain.ainvoke({"message": user_message})
        
        # Clean up the response
        title = response.content.strip('"').strip()
        if len(title.split()) > 5:  # Ensure conciseness
            title = " ".join(title.split()[:5])
        return title
    except Exception as e:
        logging.error(f"Title generation failed: {e}")
        return "Untitled Session"  # Formal fallback