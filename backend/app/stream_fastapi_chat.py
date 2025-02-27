from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.runnables import RunnableLambda, RunnablePassthrough
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_community.vectorstores import FAISS

def create_chain(chat_history):
    embeddings = OpenAIEmbeddings()
    new_vectorstore = FAISS.load_local("faiss_index", embeddings=embeddings, allow_dangerous_deserialization=True)
    retriever = new_vectorstore.as_retriever(search_kwargs={"k": 3})

    template = """Answer the question based only on the following context:
    Previous chat history with user:
    {chat_history}
    
    {context}

    Question: {question}
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
        | StrOutputParser()
    )

    return retrieval_chain


