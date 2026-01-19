# Project Map

/root
├── backend/
│   ├── api/                # Route handlers
│   ├── services/           # LLM logic & scraping
│   ├── models/             # Pydantic & SQLModel schemas
│   ├── main.py             # FastAPI entry point
│   ├── database.py         # DB connection setup
│   ├── Dockerfile          # <--- Added
│   └── requirements.txt    # <--- Added
├── frontend/
│   ├── app/                # Next.js App Router
│   ├── components/         # Shared UI (Shadcn)
│   ├── lib/                # API client & utils
│   ├── Dockerfile          # <--- Added
│   └── .dockerignore       # <--- Added
├── docs/
│   ├── PRD.md
│   ├── SPEC.md
│   └── STANDARDS.md
├── docker-compose.yml      # <--- Added: Orchestration
├── .env.example            # <--- Added: API Keys
└── README.md