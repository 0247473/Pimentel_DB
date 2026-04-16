"""
FastAPI application entry point.
Purpose: Main app, CORS, lifespan, and route mounting.
Modify: Add auth, new routes, or middleware here.
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.predict import router as predict_router
from app.services.predictor import predictor


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load ML model on startup."""
    predictor.load_model()
    yield
    # Cleanup if needed
    pass


app = FastAPI(
    title="cursor-supabase-ml-api",
    description="ML prediction API for cursor-supabase-app",
    lifespan=lifespan,
)

# CORS: allow all origins in development. In production, restrict to your frontend domain.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routes. To add a new route: create app/routes/xyz.py and app.add_router(xyz_router)
app.include_router(predict_router, prefix="", tags=["predict"])


@app.get("/health")
def health():
    """Health check endpoint. Returns model_loaded status."""
    return {
        "status": "ok",
        "model_loaded": predictor.is_loaded,
    }
