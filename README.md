# AI Insight Dashboard

A high-performance research tool that transforms raw text sources and URLs into structured, visual insights using LLMs. This project features a modern Next.js dashboard and a robust FastAPI backend.

![Dashboard Preview](https://via.placeholder.com/800x400?text=AI+Insight+Dashboard+Preview)

## 🚀 Features

- **Multi-Source Analysis:** Analyze raw text or fetch content directly from URLs.
- **AI-Powered Insights:** Uses OpenRouter (LLMs) to extract:
  - 3-sentence summary
  - Sentiment analysis (Positive/Negative/Neutral + Score)
  - Key thematic tags
- **History Tracking:** Automatically saves all analyses to a persistent SQLite database.
- **Responsive Dashboard:** Modern UI built with Next.js and Tailwind CSS (Dark/Light mode support).
- **Search:** Instant search through your analysis history.

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Language:** TypeScript

### Backend
- **Framework:** FastAPI (Python 3.12)
- **Database:** SQLite with SQLModel (WAL mode enabled)
- **AI Integration:** OpenAI SDK (connected to OpenRouter)
- **Scraping:** HTTPX + BeautifulSoup-style cleaning

### Infrastructure
- **Containerization:** Docker & Docker Compose
- **Orchestration:** Multi-stage builds for optimized images

## 🏁 Getting Started

### Prerequisites
- Docker & Docker Compose installed
- An [OpenRouter](https://openrouter.ai/) API Key

### Quick Start (Docker)

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd insight-dashboard
   ```

2. **Configure Environment:**
   Copy the example environment file and add your API key:
   ```bash
   cp .env.example .env
   # Edit .env and set OPENROUTER_API_KEY
   ```

3. **Run with Docker Compose:**
   ```bash
   docker compose up --build
   ```

4. **Access the App:**
   - **Frontend Dashboard:** [http://localhost:3000](http://localhost:3000)
   - **Backend API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

## 🔧 Local Development

### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📂 Project Structure

```
.
├── backend/                # FastAPI Application
│   ├── api/               # API Routes
│   ├── models/            # SQLModel Database Schemas
│   ├── services/          # Business Logic (LLM, Scraper)
│   ├── main.py            # App Entrypoint
│   └── Dockerfile
├── frontend/               # Next.js Application
│   ├── app/               # App Router Pages
│   ├── components/        # React Components
│   ├── lib/               # API Utilities
│   └── Dockerfile
├── data/                   # Persisted SQLite Database
├── docs/                   # Documentation (PRD, Standards)
└── docker-compose.yml      # Orchestration
```

## 📝 API Documentation

Authentication is currently open for local use.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/analyze` | Analyze text or URL and save result |
| `GET`  | `/api/v1/insights`| List history (supports search & pagination) |
| `GET`  | `/api/v1/insights/{id}` | Get details of a specific insight |

## 📜 License

This project is licensed under the MIT License.
