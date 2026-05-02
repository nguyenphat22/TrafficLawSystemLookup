import torch
import chromadb
import pandas as pd

from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer, AutoModelForCausalLM

# ==========================================================
# GLOBAL (load 1 lần)
# ==========================================================
embed_model = None
collection = None
tokenizer = None
llm_model = None
term_dict = None


# ==========================================================
# 1. LOAD MAPPING
# ==========================================================
def load_mapping(file_path):
    if file_path.endswith(".csv"):
        df = pd.read_csv(file_path)
    else:
        df = pd.read_excel(file_path)

    term_dict = {}

    for _, row in df.iterrows():
        formal = str(row['Thuat_ngu_phap_ly_chuan']).strip()
        casual_list = str(row['Tu_ngu_thong_thuong']).split(',')

        for casual in casual_list:
            c = casual.strip().lower()
            if c:
                term_dict[c] = formal

    print(f"✅ Loaded {len(term_dict)} mapping terms")
    return term_dict


# ==========================================================
# 2. INIT SYSTEM (LOAD 1 LẦN)
# ==========================================================
def initialize_system():
    global embed_model, collection, tokenizer, llm_model, term_dict

    print("🚀 Loading system...")

    # Embedding
    embed_model = SentenceTransformer('keepitreal/vietnamese-sbert')

    # ChromaDB
    chroma_client = chromadb.PersistentClient(path="./chroma_db")
    collection = chroma_client.get_collection(name="nghi_dinh_168")

    # LLM
    model_name = "Qwen/Qwen2.5-3B-Instruct"

    tokenizer = AutoTokenizer.from_pretrained(model_name)

    llm_model = AutoModelForCausalLM.from_pretrained(
        model_name,
        torch_dtype=torch.float16,
        device_map="auto"
    )

    # Mapping
    term_dict = load_mapping("./mapping.csv")

    print("✅ System ready!")


# ==========================================================
# 3. QUERY PROCESSING
# ==========================================================
def process_query(query):
    q = query.lower()

    sorted_terms = sorted(term_dict.keys(), key=len, reverse=True)

    for casual in sorted_terms:
        if casual in q:
            formal = term_dict[casual]
            new_query = q.replace(casual, formal)
            return new_query, formal

    return query, None


# ==========================================================
# 4. RETRIEVAL
# ==========================================================
import numpy as np

def retrieve_law(query):
    refined_query, formal_term = process_query(query)

    print("🔎 Query:", query)

    # ===== STAGE 1 =====
    v1 = embed_model.encode(formal_term if formal_term else query)

    results_k = collection.query(
        query_embeddings=[v1.tolist()],
        n_results=15
    )

    docs = results_k["metadatas"][0]

    # ===== STAGE 2 (RERANK LOCAL) =====
    v2 = embed_model.encode(refined_query)

    scored_docs = []

    for doc in docs:
        text = doc.get("enriched_text", "")
        emb = embed_model.encode(text)

        score = np.dot(v2, emb) / (np.linalg.norm(v2) * np.linalg.norm(emb))

        scored_docs.append((score, text))

    # sort theo score
    scored_docs.sort(reverse=True, key=lambda x: x[0])

    # lấy top 3
    top_docs = scored_docs[:3]

    context = ""
    for score, text in top_docs:
        context += f"- {text}\n"

    return context

# ==========================================================
# 5. GENERATE
# ==========================================================
def generate_answer(query, context):

    if context.strip() == "":
        return "Không tìm thấy trong dữ liệu"

    prompt = f"""Dựa vào văn bản pháp luật sau:
{context}

Câu hỏi: {query}

Trả lời NGẮN GỌN, đúng trọng tâm, nêu rõ mức phạt và điều khoản.
"""

    messages = [
        {"role": "system", "content": "Bạn là chuyên gia pháp lý."},
        {"role": "user", "content": prompt}
    ]

    text_prompt = tokenizer.apply_chat_template(
        messages,
        tokenize=False,
        add_generation_prompt=True
    )

    inputs = tokenizer(text_prompt, return_tensors="pt").to(llm_model.device)

    with torch.no_grad():
        outputs = llm_model.generate(
            **inputs,
            max_new_tokens=128,
            temperature=0.0,
            do_sample=False
        )

    answer_ids = outputs[0][inputs.input_ids.shape[1]:]
    return tokenizer.decode(answer_ids, skip_special_tokens=True)


# ==========================================================
# 6. FINAL PIPELINE
# ==========================================================
def ask(query):
    if embed_model is None:
        raise Exception("System chưa load")

    context = retrieve_law(query)
    answer = generate_answer(query, context)

    return answer, context