
# 🛡️ RegTech AI — Explainable Regulatory Compliance Assistant

An **AI-powered, citation-backed Regulatory Technology (RegTech) platform** that helps organizations **understand, compare, and operationalize regulations** with **zero hallucination** and full auditability.

Unlike generic RAG chatbots, this system provides **grounded answers, visual PDF evidence, version comparison, and compliance checklists**, making it suitable for **real-world regulatory environments**.

---

## 🚨 Problem Statement

Financial, fintech, healthcare, and regulated organizations face major challenges:

* Regulations are long, complex, and frequently updated
* Manual comparison of regulatory versions takes weeks
* AI chatbots hallucinate and cannot be trusted for compliance
* Compliance teams struggle to convert regulations into actionable tasks
* Auditors demand *proof*, not summaries

**Missing one regulatory change can lead to penalties, audits, or license suspension.**

---

## 💡 Solution Overview

**RegTech AI** ingests regulatory PDFs and provides:

* **Citation-backed answers** (no hallucinations)
* **Visual PDF highlights** for every claim
* **Side-by-side regulation version comparison**
* **AI-generated compliance checklists**
* **Explainable and auditable outputs**

Every output is **traceable to the original regulation text**.

---

## ✨ Key Features (Implemented)

### ✅ 1. Grounded RAG Question Answering

* Ask natural language compliance questions
* Answers are generated **only from retrieved document chunks**
* Inline citations included for every answer
* Safe fallback when LLM is unavailable

---

### ✅ 2. Real-Time Regulatory Document Ingestion

* Upload raw PDFs (no preprocessing required)
* Automatic text extraction, chunking, embedding, and indexing
* FAISS-backed semantic search
* Persistent vector store

---

### ✅ 3. Citation Injection & Grounding Verification

* Sentence-level grounding checks
* Each answer sentence linked to supporting chunks
* Grounding confidence available for audit review

---

### ✅ 4. PDF Viewer with Highlighted Evidence

* View original regulatory PDFs
* Highlight exact text used by the AI
* Click from answer → jump to highlighted regulation text
* Improves transparency and trust

---

### ⭐ 5. Regulation Version Comparison Engine (Differentiator)

* Compare **old vs new regulation versions**
* Automatically detects:

  * 🟢 Added clauses
  * 🔴 Removed clauses
  * 🟡 Modified clauses
* Semantic matching using embeddings (not keyword diff)

---

### ⭐ 6. Side-by-Side PDF Diff Viewer

* Old and new PDFs shown together
* Color-coded highlights for changes
* Visual, auditor-friendly comparison
* Eliminates manual regulation diff work

---

### ⭐ 7. GenAI-Powered Compliance Checklist Generator

* Convert regulations into actionable compliance tasks
* Checklist items include:

  * Task description
  * Priority (High / Medium / Low)
  * Suggested owner
  * Supporting regulatory evidence
* Grounded in retrieved regulatory text

---

## 🧠 System Architecture (High Level)

```
PDF Upload
   ↓
Text Extraction & Chunking
   ↓
Sentence Embeddings (Sentence-Transformers)
   ↓
FAISS Vector Store
   ↓
Semantic Retrieval
   ↓
Gemini-powered RAG (LangChain)
   ↓
Citation Injection & Verification
   ↓
PDF Highlight Viewer / Version Diff / Checklist Generator
```

---

## 🧰 Tech Stack

### Backend

* Python
* Flask
* FAISS (Facebook AI Similarity Search)
* Sentence-Transformers
* LangChain
* Gemini

### Frontend

* HTML + CSS + ReactJS
* PDF.js (PDF rendering & highlighting)

### AI / NLP

* Embedding-based semantic search
* Retrieval-Augmented Generation (RAG)
* Grounding verification
* Semantic clause comparison

---

## 🚀 Getting Started

### 1️⃣ Install Dependencies

```bash
pip install flask faiss-cpu sentence-transformers langchain langchain-google-genai google-generativeai pdfplumber
```

### 2️⃣ Set Gemini API Key

```bash
export GOOGLE_API_KEY="your_api_key_here"
```

### 3️⃣ Run the Server

```bash
python app.py
```

Server runs at:

```
http://localhost:8050
```

---

## 🔍 Example Demo Flow

1. Upload regulatory PDFs (e.g., RBI AML 2021 & 2023)
2. Ask a compliance question → get cited answer
3. Click citation → view highlighted PDF text
4. Compare regulation versions → see visual differences
5. Generate compliance checklist → export-ready tasks

## 🔮 Future Enhancements

* Compliance gap detection (internal policy vs regulation)
* Severity & risk scoring for regulation changes
* Exportable audit-ready compliance reports
* Role-based access (Compliance / Legal / Auditor)
* Multi-regulator support (RBI, SEBI, Basel, HIPAA, GDPR)
