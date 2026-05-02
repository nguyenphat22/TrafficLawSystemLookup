from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from rag_core import initialize_system, ask

# ===============================
# INIT APP
# ===============================
app = FastAPI()

# ===============================
# CORS
# ===============================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===============================
# LOAD MODEL KHI START
# ===============================
@app.on_event("startup")
def startup_event():
    print("🔥 Starting system...")
    initialize_system()
    print("✅ System loaded!")


# ===============================
# REQUEST SCHEMA
# ===============================
class Query(BaseModel):
    question: str


# ===============================
# ROUTES
# ===============================
@app.get("/")
def root():
    return {"message": "RAG Legal API is running 🚀"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/ask")
def ask_law(query: Query):
    try:
        answer, context = ask(query.question)

        return {
            "question": query.question,
            "answer": answer,
            "context": context
        }

    except Exception as e:
        return {"error": str(e)}