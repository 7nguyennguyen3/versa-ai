import logging
import os
from typing import List, Dict, Any

from dotenv import load_dotenv
from langchain_pinecone import PineconeVectorStore

from langchain_voyageai import VoyageAIEmbeddings
from langchain.schema import (
    Document,
)
from langchain.prompts import ChatPromptTemplate
from langchain_core.runnables import (
    RunnablePassthrough,
    RunnableLambda,
)  # Import RunnableParallel
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI
from langchain_core.retrievers import BaseRetriever


load_dotenv()

# Configure logging (basic config as a fallback if not set elsewhere)
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)

# Check environment variables
if not os.getenv("VOYAGE_API_KEY"):
    logging.warning("VOYAGE_API_KEY environment variable not set.")

if not os.getenv("PINECONE_API_KEY"):
    logging.warning("PINECONE_API_KEY environment variable not set.")

embeddings = VoyageAIEmbeddings(model="voyage-3")


# The get_retriever function does not need changes
def get_retriever(
    vectorstore: PineconeVectorStore,
    user_id: str,
    pdf_id: str,
    mode: str = "auto",
    score_threshold: float = 0.75,
    isNewSession: bool = False,
) -> BaseRetriever:
    """
    Returns an appropriate retriever based on the search mode.

    If isNewSession is True, we do a plain similarity search (no threshold).
    Otherwise, for similarity/auto we apply a relevance threshold.

    Args:
        vectorstore: The initialized PineconeVectorStore instance.
        user_id: The ID of the user for filtering.
        pdf_id: The ID of the PDF for filtering.
        mode: The search mode ('similarity', 'mmr', 'hybrid', 'auto').
        score_threshold: Minimum relevance score for similarity search.
        isNewSession: If True, bypasses threshold filtering.

    Returns:
        A Langchain BaseRetriever instance.
    """
    # Base kwargs: filter by user and pdf, return up to k documents pre-filtering
    search_kwargs: Dict[str, Any] = {
        "filter": {"userId": user_id, "pdfId": pdf_id},
        "k": 5,
    }

    logging.info(
        f"Configuring retriever for mode={mode!r} with userId={user_id[-6:]} pdfId={pdf_id[-6:]}"
    )

    # Validate mode
    valid_modes = {"similarity", "mmr", "hybrid"}
    if mode not in valid_modes:
        logging.warning(f"Invalid/auto mode {mode!r}, defaulting to 'similarity'")
        mode = "similarity"

    # Decide actual search type
    if mode in ("similarity", "auto"):
        if isNewSession:
            actual_search_type = "similarity"
            logging.info("New session: using plain similarity search (no threshold).")
        else:
            actual_search_type = "similarity_score_threshold"
            search_kwargs["score_threshold"] = score_threshold
            logging.info(
                f"Continuing session: using similarity with threshold={score_threshold}"
            )
    else:
        actual_search_type = mode

    # Instantiate retriever based on type
    if actual_search_type == "similarity":
        logging.info("Similarity search configured without score threshold.")
        return vectorstore.as_retriever(
            search_type="similarity",
            search_kwargs=search_kwargs,
        )

    if actual_search_type == "similarity_score_threshold":
        logging.info(f"Similarity search with threshold; search_kwargs={search_kwargs}")
        return vectorstore.as_retriever(
            search_type="similarity_score_threshold",
            search_kwargs=search_kwargs,
        )

    if actual_search_type == "mmr":
        search_kwargs["lambda_mult"] = 0.5
        logging.warning("MMR mode: threshold is not directly applied.")
        logging.info("MMR search configured.")
        return vectorstore.as_retriever(search_type="mmr", search_kwargs=search_kwargs)

    if actual_search_type == "hybrid":
        logging.warning("Hybrid mode: ensure vectors ingested with sparse indexing.")
        logging.info("Hybrid search configured.")
        return vectorstore.as_retriever(
            search_type="hybrid", search_kwargs=search_kwargs
        )

    # Fallback (shouldn't happen)
    logging.error(
        f"Unexpected search type: {actual_search_type!r}, falling back to similarity."
    )
    return vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"filter": search_kwargs["filter"], "k": search_kwargs["k"]},
    )


# Helper function to format documents with metadata (no changes needed)
def format_docs_with_metadata(docs: List[Document]) -> str:
    """
    Formats a list of Documents into a single string for the LLM prompt.
    Includes source metadata formatted as (p.X) or (p.X, Y/Y).

    Args:
        docs: A list of Langchain Document objects, expected to have
              'page' (int) and 'segment' (str like '1/1', '1/2') in metadata.

    Returns:
        A single string containing the formatted content of all documents,
        separated by '---'.
    """
    formatted_string = ""
    for i, doc in enumerate(docs):
        # Safely get page and segment metadata
        page = doc.metadata.get("page", "N/A")
        segment = doc.metadata.get("segment", "N/A")

        # --- Logic to create the concise citation prefix ---
        citation_prefix = ""
        # Check if page metadata is available and looks like a number
        if isinstance(page, (int, float)) and page != "N/A":
            # Format page number (remove .0 if it's a float like 15.0)
            page_str = str(int(page)) if isinstance(page, float) else str(page)

            if segment == "1/1":
                # Format for a full page (segment 1/1)
                citation_prefix = f"(p.{page_str})"
            elif segment != "N/A":
                # Format for a segmented page (e.g., 1/2, 2/2, 1/3)
                citation_prefix = f"(p.{page_str}, {segment})"
            else:
                # Fallback if page is available but segment is missing
                citation_prefix = f"[Source: Page {page_str}, Segment Unknown]"
        else:
            # Fallback if page metadata is missing or invalid
            citation_prefix = "[Source: Metadata Missing]"
        # --- End of citation prefix logic ---

        # Combine the citation prefix and the document content
        # Put the citation on its own line before the content for clarity for the LLM
        formatted_string += f"{citation_prefix}\n{doc.page_content}\n"

        # Add a separator between documents, but not after the last one
        if i < len(docs) - 1:
            formatted_string += "---\n"

    return formatted_string


# --- Corrected create_chain function signature and chain definition ---
def create_chain(
    chat_history: List[str],  # Keep this parameter - it's provided by chat_send
    user_id: str,
    pdf_id: str,
    preferred_model: str = "gemini-2.0",
    mode: str = "auto",
    demo: bool = False,
    isNewSession: bool = False,
):
    mode = mode if mode in {"similarity", "mmr", "hybrid"} else "auto"

    index_name = "versa-ai-demo" if demo else "versa-ai-voyage"
    logging.info(f"Connecting to Pinecone index: {index_name}")
    try:
        vectorstore = PineconeVectorStore.from_existing_index(index_name, embeddings)
        logging.info(f"Successfully connected to index: {index_name}")
    except Exception as e:
        logging.error(
            f"Failed to connect to Pinecone index {index_name}: {e}", exc_info=True
        )
        raise ConnectionError(
            f"Could not connect to Pinecone index {index_name}"
        ) from e

    # Get the retriever
    retriever = get_retriever(
        vectorstore, user_id, pdf_id, mode=mode, isNewSession=isNewSession
    )

    # Define the prompt template
    # Updated instructions to reference the new document formatting
    template = """You are a helpful AI assistant answering questions based on provided documents and conversation history.
Your primary goal is to use the information in the 'Retrieved Documents' section to answer the 'User Question'.
Use the 'Chat History' to understand the context of the conversation and avoid repeating information.

Instructions:

1.  **Prioritize Context:** Base your answer strictly on the 'Retrieved Documents'. Do not add information not found there unless the documents explicitly lack the necessary information to answer the question *at all*.
2.  **Cite Sources:** When you use information from the 'Retrieved Documents', include the source citation (e.g., (p.3) or (p.3, 1/2)) that precedes the relevant text in the document section. If information comes from multiple sources, cite all relevant ones. Place the citation at the end of the sentence or paragraph that uses the information.
3.  **Acknowledge Gaps:** If the documents do not contain the answer, state that clearly (e.g., "The provided documents don't contain information about X.").
4.  **Use Chat History:** Refer to the 'Chat History' to maintain conversational context and build upon previous turns.

---
Chat History:
{chat_history}
---
Retrieved Documents:
{context}
---
User Question: {question}
---

Answer:
"""

    prompt = ChatPromptTemplate.from_template(template)

    logging.info(f"Configuring LLM model: {preferred_model}")
    try:
        if preferred_model == "gemini-2.0":
            model = ChatGoogleGenerativeAI(
                temperature=0,
                model="gemini-2.0-flash-001",
            )
            logging.info("Configured ChatGoogleGenerativeAI (gemini-2.0-flash-001).")
        else:
            logging.warning(
                f"Preferred model '{preferred_model}' is not 'gemini-2.0'. Defaulting to ChatOpenAI (gpt-4o-mini)."
            )
            model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
            logging.info("Configured ChatOpenAI (gpt-4o-mini).")

    except Exception as e:
        logging.error(
            f"Failed to initialize LLM model {preferred_model} or default: {e}",
            exc_info=True,
        )
        # Re-raise a specific error if LLM initialization fails
        raise ValueError(f"Could not initialize LLM model {preferred_model}") from e
    # --- End of Updated LLM Initialization Logic ---

    logging.info("Building retrieval chain...")

    # --- Corrected Chain Definition ---
    # This chain expects a single string input (the user question or refined query)
    retrieval_chain = (
        {
            # The RunnablePassthrough() here means the input string (the query) is passed to the retriever.
            # The output of the retriever (List[Document]) is then passed to format_docs_with_metadata.
            # The string output of format_docs_with_metadata is assigned to 'context'.
            "context": RunnablePassthrough()
            | retriever
            | RunnableLambda(format_docs_with_metadata),
            # This Lambda ignores the chain's input string and uses the chat_history variable
            # from the enclosing scope of the create_chain function.
            # This is the key to using the history passed directly to create_chain.
            "chat_history": RunnableLambda(lambda x: chat_history),
            # The RunnablePassthrough() here means the chain's input string (the query)
            # is passed through and assigned to 'question'.
            "question": RunnablePassthrough(),
        }
        | prompt
        | model
    )

    logging.info("Retrieval chain created successfully.")
    return retrieval_chain
