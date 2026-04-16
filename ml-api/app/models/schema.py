"""
Pydantic models for request/response.
Purpose: Validate API payloads and responses.
Modify: Update PredictionInput fields to match your model's expected input features.
"""
from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, Optional

from pydantic import BaseModel, Field


class PredictionInput(BaseModel):
    """Input for prediction. Uses flexible features dict to support any dataset."""
    features: Dict[str, Any] = Field(default_factory=dict, description="Input feature dict")
    # Alternative: define explicit fields for your model:
    # feature1: float
    # feature2: float
    # feature3: float


class PredictionOutput(BaseModel):
    """Prediction response."""
    prediction: Any
    confidence: float = Field(ge=0, le=1)
    label: str = ""
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    probabilities: Optional[Dict[str, float]] = None
