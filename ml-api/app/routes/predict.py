# ml-api/app/routes/predict.py

from fastapi import APIRouter, Body, HTTPException

from app.models.schema import PredictionOutput
from app.services.predictor import predictor

router = APIRouter()


@router.post("/predict", response_model=PredictionOutput)
def predict(body: dict = Body(...)):
    """Accept both formats: { features: {...} } or flat { gender, ethnicity, ... }."""
    features = body.get("features", body)
    if not predictor.is_loaded:
        raise HTTPException(
            status_code=503,
            detail="Model not available. Ensure model.pkl exists in ml-api/model/.",
        )
    result = predictor.predict(features)
    return PredictionOutput(**{k: v for k, v in result.items() if k in ("prediction", "confidence", "label", "probabilities")})