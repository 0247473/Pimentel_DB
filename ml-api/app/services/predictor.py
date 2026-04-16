# ml-api/app/services/predictor.py

import pickle
import numpy as np
from pathlib import Path

class Predictor:
    def __init__(self):
        self.model = None
        self.encoders = None
        self.features = None
        self._load_model()

    def _load_model(self):
        # Path relativo al script: app/services/ -> ml-api/model/model.pkl
        script_dir = Path(__file__).resolve().parent
        model_path = script_dir.parent.parent / "model" / "model.pkl"
        
        if not model_path.exists():
            print("⚠️  model.pkl no encontrado — el servidor arrancará sin modelo")
            return
        
        with open(str(model_path), 'rb') as f:
            data = pickle.load(f)
        
        self.model = data['model']
        self.encoders = data['encoders']
        self.features = data['features']
        print("✅ Modelo cargado exitosamente")

    @property
    def is_loaded(self):
        return self.model is not None

    def load_model(self):
        """Reload model (e.g. on startup)."""
        self._load_model()

    def predict(self, input_data: dict) -> dict:
        # Construye el vector de features en el orden correcto
        row = []
        for feature in self.features:
            value = input_data[feature]
            # Si la columna es categórica, la convierte con el encoder
            if feature in self.encoders:
                value = self.encoders[feature].transform([value])[0]
            row.append(value)
        
        X = np.array([row])
        
        # predict_proba devuelve la probabilidad de cada clase [reprueba, aprueba]
        probabilities = self.model.predict_proba(X)[0]
        prediction = int(self.model.predict(X)[0])
        
        return {
            'prediction': prediction,
            'label': 'Aprueba' if prediction == 1 else 'Reprueba',
            'confidence': float(max(probabilities)),
            'probabilities': {
                'pass': float(probabilities[1]),
                'fail': float(probabilities[0])
            }
        }


# Singleton instance for use in routes and main app
predictor = Predictor()