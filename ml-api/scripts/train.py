# ml-api/scripts/train.py

import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
import pickle
from pathlib import Path

# ── 1. CARGAR DATOS ──────────────────────────────────────────────────────────
# Path relativo al script: ml-api/scripts/ -> proyecto/data/students.csv
SCRIPT_DIR = Path(__file__).resolve().parent
DATA_PATH = SCRIPT_DIR.parent.parent / "data" / "students.csv"
MODEL_DIR = SCRIPT_DIR.parent / "model"  # ml-api/model
MODEL_PATH = MODEL_DIR / "model.pkl"
df = pd.read_csv(DATA_PATH)

print(f"Dataset cargado: {len(df)} filas, {len(df.columns)} columnas")
print(df.head())

# ── 2. CREAR LA VARIABLE OBJETIVO ────────────────────────────────────────────
# Esta es exactamente la misma lógica que usamos en Supabase con SQL
df['pass_math'] = (df['math_score'] >= 60).astype(int)

print(f"\nDistribución de pass_math:")
print(df['pass_math'].value_counts())

# ── 3. PREPROCESAR ───────────────────────────────────────────────────────────
# Las columnas categóricas (texto) hay que convertirlas a números
# porque los modelos de ML solo entienden números

# Columnas que usaremos como features (inputs del modelo)
features = ['gender', 'ethnicity', 'parental_education', 
            'lunch', 'test_prep', 'reading_score', 'writing_score']

# Columna que queremos predecir (output del modelo)
target = 'pass_math'

# Separamos X (inputs) e y (output)
X = df[features].copy()
y = df[target]

# Convertimos columnas de texto a números usando LabelEncoder
# Guardamos los encoders para usarlos después en las predicciones
encoders = {}
categorical_cols = ['gender', 'ethnicity', 'parental_education', 'lunch', 'test_prep']

for col in categorical_cols:
    le = LabelEncoder()
    X[col] = le.fit_transform(X[col])
    encoders[col] = le
    print(f"{col}: {dict(zip(le.classes_, le.transform(le.classes_)))}")

# ── 4. DIVIDIR EN TRAIN Y TEST ───────────────────────────────────────────────
# 80% para entrenar, 20% para evaluar
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print(f"\nTrain: {len(X_train)} filas — Test: {len(X_test)} filas")

# ── 5. ENTRENAR EL MODELO ────────────────────────────────────────────────────
# Random Forest: conjunto de múltiples árboles de decisión
model = RandomForestClassifier(
    n_estimators=100,   # 100 árboles en el bosque
    max_depth=10,       # profundidad máxima de cada árbol
    random_state=42     # para reproducibilidad
)

model.fit(X_train, y_train)
print("\nModelo entrenado exitosamente")

# ── 6. EVALUAR EL MODELO ─────────────────────────────────────────────────────
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print(f"\nAccuracy: {accuracy:.2%}")
print("\nReporte completo:")
print(classification_report(y_test, y_pred, target_names=['Reprueba', 'Aprueba']))

# Feature importance: qué tan importante es cada variable para el modelo
print("\nImportancia de cada feature:")
for feat, imp in sorted(zip(features, model.feature_importances_), 
                         key=lambda x: x[1], reverse=True):
    print(f"  {feat}: {imp:.3f}")

# ── 7. GUARDAR EL MODELO ─────────────────────────────────────────────────────
# Guardamos todo lo necesario para hacer predicciones:
# - el modelo entrenado
# - los encoders para convertir texto a números
# - la lista de features en el orden correcto
model_data = {
    'model': model,
    'encoders': encoders,
    'features': features,
    'target': target
}

MODEL_DIR.mkdir(parents=True, exist_ok=True)
with open(MODEL_PATH, 'wb') as f:
    pickle.dump(model_data, f)

print(f"\n[OK] Modelo guardado en {MODEL_PATH}")
print(f"   Tamaño del archivo: {MODEL_PATH.stat().st_size / 1024:.1f} KB")