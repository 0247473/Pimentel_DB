# cursor-supabase-app

A production-ready template for building data visualization applications with React, Supabase, and ML. Clone this repo and start building your own app using Cursor AI as your primary development tool.

## What This Is

This template provides a full-stack foundation: a React frontend with Recharts visualizations, Supabase for the database, and a FastAPI ML API. Everything is wired up with environment variables, reusable components, and clear comments so you can adapt it to your dataset without hunting through the codebase.

## Prerequisites

- **Node.js 18+**
- **Python 3.10+**
- **Supabase account** — [supabase.com](https://supabase.com)
- **Render account** — [render.com](https://render.com) (for ML API)
- **Vercel account** — [vercel.com](https://vercel.com) (for frontend)
- **Cursor IDE** — [cursor.com](https://cursor.com)

## Setup in 5 Steps

### 1. Clone the repo

```bash
git clone https://github.com/your-org/cursor-supabase-app.git
cd cursor-supabase-app
```

### 2. Configure Supabase

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. Open **SQL Editor** and run `supabase/migrations/001_initial_schema.sql`.
3. Optionally run `supabase/seed.sql` for sample data, or use **Table Editor > Import from CSV** to upload your own data.

### 3. Configure environment variables

Copy `frontend/.env.example` to `frontend/.env.local` and fill in:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_KEY=your-anon-public-key
VITE_ML_API_URL=http://localhost:8000
VITE_APP_TITLE=My Data App
```

Find URL and key in **Supabase Dashboard > Project Settings > API**.

### 4. Configure Cursor MCP

Replace `YOUR_SUPABASE_PERSONAL_ACCESS_TOKEN_HERE` in `.cursor/mcp.json` with your token from [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens). This lets Cursor AI interact with your Supabase project.

### 5. Run locally

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**ML API:**
```bash
cd ml-api
python -m venv venv
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Open [http://localhost:5173](http://localhost:5173) for the app.

## How to Use Cursor to Build on This Template

With the project rules in `.cursor/rules/`, Cursor understands the stack. Example prompts:

1. **"Add a new bar chart to the dashboard showing revenue by region"** — Cursor will use the BarChartWidget and wire it to Supabase via useSupabase.
2. **"Filter the Data Explorer by date range"** — Cursor will extend FilterBar and DataExplorer.
3. **"Change the Predictor form to accept 5 features instead of 3"** — Cursor will update PREDICTOR_FIELDS and the schema.
4. **"Add a line chart for monthly trends"** — Cursor will use LineChartWidget and aggregateByKey.
5. **"Create a new page for inventory"** — Cursor will add a route, page, and useSupabase for your table.

## How to Deploy

### Frontend (Vercel)

1. Push the repo to GitHub.
2. In Vercel, create a new project and import the repo.
3. Set **Root Directory** to `frontend` or use the default (vercel.json handles build).
4. Add environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_KEY`, `VITE_ML_API_URL`, `VITE_APP_TITLE`.
5. Deploy.

### ML API (Render)

1. In Render, create a **Web Service**.
2. Connect the same GitHub repo.
3. Set **Root Directory** to `ml-api`.
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add `VITE_ML_API_URL` to the frontend env with the Render URL (e.g. `https://cursor-supabase-ml-api.onrender.com`).

## Project Structure

| Folder | Purpose |
|--------|---------|
| `.cursor/` | MCP config and project rules for Cursor AI |
| `frontend/` | React + Vite app, Recharts, Supabase client |
| `ml-api/` | FastAPI ML service, scikit-learn, predictor |
| `supabase/` | Migrations and seed SQL |
| `data/` | Place CSV files here for training and import |

## How to Adapt for Your Own Dataset

1. **`supabase/migrations/001_initial_schema.sql`** — Define your table.
2. **`frontend/src/pages/Dashboard.jsx`** — Replace `APP_CONFIG.tableName` and chart keys.
3. **`frontend/src/pages/DataExplorer.jsx`** — Update `TABLE_NAME`, `COLUMNS`, `FILTER_CONFIG`.
4. **`ml-api/scripts/train.py`** — Set `CSV_FILE`, `TARGET_COLUMN`, `FEATURE_COLUMNS`.
5. **`frontend/src/pages/Predictor.jsx`** — Set `PREDICTOR_FIELDS` and `MODEL_DESCRIPTION`.
