from langchain_openai import ChatOpenAI
from langchain_voyageai import VoyageAIEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.runnables import RunnableLambda, RunnablePassthrough
from langchain_core.prompts import ChatPromptTemplate
from langchain_pinecone import Pinecone
import logging


def get_retriever(vectorstore, user_id, pdf_id, mode="auto"):
    """Returns an appropriate retriever based on the search mode."""
    search_kwargs = {
        "filter": {"userId": user_id, "pdfId": pdf_id},
        "k": 4,
    }

    if mode == "similarity":
        return vectorstore.as_retriever(
            search_type="similarity", search_kwargs=search_kwargs
        )

    elif mode == "mmr":
        search_kwargs["lambda_mult"] = 0.3  # Adjust for diversity
        return vectorstore.as_retriever(search_type="mmr", search_kwargs=search_kwargs)

    elif mode == "hybrid":
        return vectorstore.as_retriever(
            search_type="hybrid", search_kwargs=search_kwargs
        )

    else:  # Auto mode (default to MMR for better balance)
        return vectorstore.as_retriever(
            search_type="similarity", search_kwargs=search_kwargs
        )


def create_chain(
    chat_history,
    user_id: str,
    pdf_id: str,
    preferred_model: str = "gemini-2.0",
    mode: str = "auto",
    demo: bool = False,
):
    mode = mode if mode in {"similarity", "mmr", "hybrid"} else "auto"

    embeddings = VoyageAIEmbeddings(model="voyage-3")
    if demo == True:
        vectorstore = Pinecone.from_existing_index("versa-ai-demo", embeddings)
    else:
        vectorstore = Pinecone.from_existing_index("versa-ai-voyage", embeddings)

    retriever = get_retriever(vectorstore, user_id, pdf_id, mode=mode)

    template = """You are a helpful AI assistant answering questions based on provided documents and conversation history.
        Your primary goal is to use the information in the 'Retrieved Documents' section to answer the 'User Question'.
        Use the 'Chat History' to understand the context of the conversation and avoid repeating information.

        Instructions:

        1.  Prioritize Context: Base your answer strictly on the 'Retrieved Documents'. Do not add information not found there unless the documents explicitly lack the necessary information to answer the question *at all*.
        2.  Acknowledge Gaps: If the documents do not contain the answer, state that clearly (e.g., "The provided documents don't contain information about X."). You may provide relevant general knowledge *only* if the documents are insufficient AND doing so directly addresses the user's likely need, but clearly label it as external information (e.g., "Based on general knowledge outside the documents...").
        3.  Clarify Ambiguity: If the 'User Question' is unclear, ambiguous, or seems to misunderstand the context, ask for clarification before providing a potentially incorrect answer.
        4.  Be Concise and Relevant: Provide clear, direct answers focused on the user's query. If the relevant context is very long, summarize the key points first and ask if the user needs more detail on a specific aspect.
        5.  Use Chat History: Refer to the 'Chat History' to maintain conversational context and avoid redundancy. If the user asks something already covered, gently point it out or build upon the previous answer.

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

    if preferred_model == "gemini-2.0":
        model = ChatGoogleGenerativeAI(
            temperature=0, streaming=True, model="gemini-2.0-flash-001"
        )
    else:
        model = ChatOpenAI(model="gpt-4o-mini", temperature=0, streaming=True)

    logging.info(f"🚀🚀 Using model: {preferred_model}")

    retrieval_chain = (
        {
            "context": retriever,
            "chat_history": RunnableLambda(lambda x: chat_history),
            "question": RunnablePassthrough(),
        }
        | prompt
        | model
    )

    return retrieval_chain
