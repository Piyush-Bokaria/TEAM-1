# Backend API Endpoints

Integration guide for the RegTech frontend. All endpoints assume a standard REST structure.

## 1. Dashboard (User & Admin)

### Metrics & Stats
- **GET** `/api/dashboard/metrics`
  // Returns high-level counters (e.g., total docs, alerts, ingestion status) for the top cards.
  // Call on mount in `UserDashboard.tsx` and `AdminDashboard.tsx`.

### Activity Feed
- **GET** `/api/activity-logs`
  // Returns a chronological list of user actions (uploads, generations, updates).
  // Mapped to the Activity Feed section in `UserDashboard.tsx`.

## 2. Document Library

### List Documents
- **GET** `/api/documents`
  // Returns paginated metadata list with support for query params `?q=search&status=active`.
  // Used in `UserDocuments.tsx` table and Admin list.

### Upload Document
- **POST** `/api/documents/upload`
  // Accepts `multipart/form-data` (file) to start the ingestion/vectorization pipeline.
  // Used in `AdminUploadPage.tsx` on drop/submit.

### Get Document Details
- **GET** `/api/documents/:id`
  // Returns full metadata and raw text content for a specific file.
  // Used in `DocumentViewer.tsx` to display the PDF text view.

### Analyze Document (Clauses)
- **POST** `/api/documents/:id/analyze`
  // Triggers Gemini to extract clauses, risk levels, and tags from the document text.
  // Called when clicking "Analyze with Gemini" in `DocumentViewer.tsx`.

### Semantic Search
- **GET** `/api/search`
  // Accepts `?q=query` to perform vector search against the RAG database.
  // Used in `SearchPage.tsx` to return relevant snippets and scores.

## 3. Ask Compliance AI (RAG)

### Chat Completion
- **POST** `/api/ai/chat`
  // Accepts `{ message, history }`, returns AI response with cited sources (RAG).
  // Used in `AskAI.tsx` for the main conversational interface.

## 4. Checklist Generator

### Generate Checklist
- **POST** `/api/ai/checklist`
  // Accepts `{ topic }` or `{ documentId }`, returns a list of actionable tasks.
  // Used in `ChecklistGenerator.tsx` on "Generate" click.

## 5. Version Comparison

### Compare Versions
- **POST** `/api/ai/compare`
  // Accepts `{ sourceDocId, targetDocId }`, returns AI summary of changes + raw text of both.
  // Used in `VersionComparison.tsx` to populate the `DiffVisualizer` and summary text.
