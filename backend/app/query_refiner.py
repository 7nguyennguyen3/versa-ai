# query_refiner.py

import logging
import time
from typing import List
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import SystemMessage, BaseMessage

# --- Constants ---
# Define the system prompt centrally
REFINE_QUERY_SYSTEM_PROMPT = """You are an AI assistant expert at refining user queries for better information retrieval from a vector database based on chat history.
Rewrite the user's 'LATEST QUERY' to be clearer, more specific, and self-contained, incorporating relevant context from the 'CHAT HISTORY'.
Focus on extracting key entities, intents, and relationships mentioned previously.
If the LATEST QUERY is already clear and specific given the history, return it as is.
ONLY return the refined query text. Do not add any explanations, greetings, or introductions like "Here is the refined query:"."""

# Define the prompt template centrally
REFINE_QUERY_PROMPT = ChatPromptTemplate.from_messages(
    [
        SystemMessage(content=REFINE_QUERY_SYSTEM_PROMPT),
        MessagesPlaceholder(variable_name="chat_history"),
        # Assuming the latest query is passed separately and also included in chat_history
        ("human", "LATEST QUERY: {query}"),
    ]
)

# Consider instantiating the LLM once if settings are always the same,
# or inside the function if you need flexibility per call.
# For simplicity and flexibility let's instantiate inside the function for now.
# llm_refine = ChatGoogleGenerativeAI(model="gemini-1.5-flash-latest", temperature=0.1) # Example global instance


async def refine_user_query(
    chat_history: List[BaseMessage],
    query: str,
    model_name: str = "gemini-1.5-flash",
    temperature: float = 0.1,
    logger: logging.Logger = logging.getLogger(
        __name__
    ),  # Use default logger if none provided
) -> str:
    """
    Refines a user query based on chat history using a Google Generative AI model.

    Args:
        chat_history: The list of BaseMessage objects representing the conversation history.
                      (Should ideally include the latest user query message).
        query: The latest user query string to refine.
        model_name: The name of the Google model to use.
        temperature: The temperature setting for the LLM.
        logger: The logger instance to use.

    Returns:
        The refined query string, or the original query if refinement is skipped or fails.
    """
    refined_query = query  # Default to original

    # Skip refinement if there's no history context (besides the current query itself)
    # Check if history contains more than just the latest human message
    if not chat_history or len(chat_history) <= 1:
        logger.info(
            f"Skipping query refinement for '{query}' (no prior history context)."
        )
        return refined_query

    try:
        # Instantiate the LLM (ensure GOOGLE_API_KEY is in env)
        llm_refine = ChatGoogleGenerativeAI(model=model_name, temperature=temperature)

        # Create the refinement chain
        refine_chain = REFINE_QUERY_PROMPT | llm_refine

        # Invoke the refinement chain
        logger.info(f"Refining query '{query}' using history.")
        refinement_start_time = time.time()

        refined_query_result = await refine_chain.ainvoke(
            {"chat_history": chat_history, "query": query}
        )
        refined_query = refined_query_result.content  # Extract the string content
        refinement_duration = time.time() - refinement_start_time
        logger.info(f"✨ Original query: '{query}'")
        logger.info(
            f"✨ Refined query: '{refined_query}' (took {refinement_duration:.2f}s)"
        )

    except Exception as refine_error:
        logger.error(
            f"⚠️ Error during query refinement for '{query}': {refine_error}. Using original query."
        )
        refined_query = query  # Fallback to original query on error

    return refined_query
