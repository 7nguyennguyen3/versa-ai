from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.runnables import RunnableLambda, RunnablePassthrough
from langchain_core.prompts import ChatPromptTemplate
from langchain_pinecone import Pinecone

def get_retriever(vectorstore, user_id, pdf_id, mode="auto"):
    """Returns an appropriate retriever based on the search mode."""
    search_kwargs = {
        "filter": {"userId": user_id, "pdfId": pdf_id},
        "k": 4,
    }

    if mode == "similarity":
        return vectorstore.as_retriever(search_type="similarity", search_kwargs=search_kwargs)

    elif mode == "mmr":
        search_kwargs["lambda_mult"] = 0.3  # Adjust for diversity
        return vectorstore.as_retriever(search_type="mmr", search_kwargs=search_kwargs)

    elif mode == "hybrid":
        return vectorstore.as_retriever(search_type="hybrid", search_kwargs=search_kwargs)

    else:  # Auto mode (default to MMR for better balance)
        return vectorstore.as_retriever(search_type="similarity", search_kwargs=search_kwargs)


def create_chain(chat_history, user_id: str, pdf_id: str, mode: str = "auto", demo: bool = False):
    mode = mode if mode in {"similarity", "mmr", "hybrid"} else "auto"

    embeddings = OpenAIEmbeddings()
    if demo==True:
        vectorstore = Pinecone.from_existing_index("versa-ai", embeddings)
    else:
        vectorstore = Pinecone.from_existing_index("development", embeddings)

    retriever = get_retriever(vectorstore, user_id, pdf_id, mode=mode)

    template = """Answer the question based only on the following context:
    --- Guidelines ---
    1. **If the context provides a clear and accurate answer**, respond directly using the most relevant information.
    2. **If the question is vague, ambiguous, or missing details**, politely ask the user for clarification before proceeding.
    3. **If the context lacks relevant information**, acknowledge the gap and provide general knowledge where appropriate. 
    4. **If the question involves historical events or multiple interpretations**, briefly summarize key points and ask if the user needs more details.
    5. **Always be concise but informative.** Keep responses clear, and when necessary, provide references or suggest further reading.
    6. **If the context is too long or complex**, summarize the main points and ask if the user wants more details on a specific aspect.

    Now answer the question based on the context below:
    User question: {question}

    Previous chat history with user:
    {chat_history}

    Documents that are being fetched from the vectorstore:
    {context}
    """

    prompt = ChatPromptTemplate.from_template(template)
    model = ChatOpenAI(temperature=0, streaming=True, model="gpt-4o-mini")

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

