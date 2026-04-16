# PRD — EduInsights: Student Performance Analytics App
**Versión:** 1.0  
**Fecha:** Marzo 2026  
**Estado:** Listo para diseño en Stitch  
**Autor:** Curso de Desarrollo con IA — Maestría en Ciencia de Datos

---

> **Nota para alumnos:** Este PRD es el documento de referencia central de tu proyecto. Todo lo que construyas — el diseño en Stitch, los componentes en Figma, el código generado en Cursor — debe estar alineado con lo que aquí se describe. Cuando le des un prompt al agente de Cursor, referencia este documento. Cuando le pidas a Stitch que genere una pantalla, copia la sección correspondiente de este PRD como prompt.

---

## 1. Visión del Producto

**EduInsights** es una aplicación web de análisis de rendimiento académico que permite a coordinadores y docentes explorar patrones en los resultados de exámenes de estudiantes, identificar factores de riesgo y predecir si un alumno aprobará matemáticas antes de que se aplique el examen.

La aplicación transforma un dataset de 1,000 registros de estudiantes en una herramienta de toma de decisiones accionable, combinando visualización de datos interactiva con un modelo de Machine Learning desplegado en la nube.

**Problema que resuelve:** Los coordinadores académicos no tienen visibilidad rápida sobre qué factores (nivel educativo de los padres, preparación previa, tipo de almuerzo como proxy socioeconómico) correlacionan con el rendimiento. Tampoco tienen una herramienta para identificar alumnos en riesgo antes del examen.

**Usuario objetivo:** Coordinadores académicos y docentes con acceso a datos de estudiantes. Conocimiento técnico bajo — deben poder usar la app sin capacitación.

---

## 2. Identidad Visual

> **Esta sección es el input principal para Stitch.** Úsala completa como prompt de diseño.

### Nombre y concepto
- **Nombre:** EduInsights
- **Tagline:** "Datos que transforman el aprendizaje"
- **Concepto visual:** Profesional, limpio y accesible. Inspirado en dashboards de analytics corporativos pero con calidez académica. Sin elementos decorativos innecesarios.

### Paleta de colores

| Rol | Color | Hex | Uso |
|-----|-------|-----|-----|
| Primary | Índigo profundo | `#4F46E5` | Botones principales, links, íconos activos |
| Primary Light | Índigo suave | `#EEF2FF` | Fondos de cards, highlights |
| Success | Verde esmeralda | `#10B981` | KPIs positivos, predicción "Aprueba" |
| Danger | Rojo coral | `#EF4444` | KPIs negativos, predicción "Reprueba" |
| Warning | Ámbar | `#F59E0B` | Alertas, tendencias neutras |
| Background | Gris muy claro | `#F8FAFC` | Fondo general de la app |
| Surface | Blanco | `#FFFFFF` | Cards, modales, paneles |
| Border | Gris claro | `#E2E8F0` | Bordes de cards y separadores |
| Text Primary | Gris oscuro | `#1E293B` | Títulos y texto principal |
| Text Secondary | Gris medio | `#64748B` | Subtítulos, labels, placeholders |

### Tipografía
- **Fuente principal:** Inter (Google Fonts)
- **Tamaños:**
  - H1 (título de página): 28px, weight 700
  - H2 (títulos de sección): 20px, weight 600
  - H3 (títulos de card): 16px, weight 600
  - Body: 14px, weight 400
  - Label / caption: 12px, weight 500
  - KPI value: 36px, weight 700

### Componentes base del Design System

**Cards:** Fondo blanco, border-radius 12px, sombra sutil `box-shadow: 0 1px 3px rgba(0,0,0,0.08)`, padding 24px, borde `1px solid #E2E8F0`.

**Botones primarios:** Fondo `#4F46E5`, texto blanco, border-radius 8px, padding 10px 20px, font-weight 600. Hover: `#4338CA`.

**Botones secundarios:** Fondo transparente, borde `1px solid #E2E8F0`, texto `#1E293B`, border-radius 8px.

**Inputs:** Borde `1px solid #E2E8F0`, border-radius 8px, padding 10px 14px, font-size 14px. Focus: borde `#4F46E5` y sombra suave.

**Badges:** Border-radius 999px (pill), padding 2px 10px, font-size 12px, font-weight 500. Variantes: verde (success), rojo (danger), ámbar (warning), gris (neutral).

**Sidebar:** Fondo `#1E293B` (oscuro), íconos y texto en blanco/gris claro. Item activo con fondo `#4F46E5` y border-radius 8px. Ancho: 240px.

### Gráficas (Recharts)
- Color principal de barras y líneas: `#4F46E5`
- Color secundario (comparaciones): `#10B981`
- Tercer color (terciario): `#F59E0B`
- Pie chart: usar paleta `['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']`
- Grid lines: `#F1F5F9`, strokeDasharray `3 3`
- Tooltip: fondo blanco, sombra, border-radius 8px
- Todos los textos de ejes en `#64748B`, font-size 12px

---

## 3. Arquitectura de la Aplicación

```
┌─────────────────────────────────────────────┐
│              EduInsights Frontend            │
│         React 18 + Vite + Recharts          │
│              Deploy: Vercel                  │
└──────────────┬───────────────┬──────────────┘
               │               │
               ▼               ▼
┌──────────────────┐  ┌────────────────────┐
│  Supabase        │  │  ML API            │
│  PostgreSQL DB   │  │  FastAPI + sklearn │
│  REST API auto   │  │  Deploy: Render    │
│  generada        │  │  POST /predict     │
└──────────────────┘  └────────────────────┘
```

### Variables de entorno requeridas (frontend)
```
VITE_SUPABASE_URL=https://[project-id].supabase.co
VITE_SUPABASE_KEY=[anon-public-key]
VITE_ML_API_URL=https://[render-service].onrender.com
VITE_APP_TITLE=EduInsights
```

---

## 4. Dataset

**Fuente:** Students Performance in Exams — Kaggle  
**Filas:** 1,000 estudiantes  
**Tabla en Supabase:** `students`

### Esquema de la tabla

```sql
CREATE TABLE students (
  id              SERIAL PRIMARY KEY,
  gender          TEXT,           -- 'male' | 'female'
  ethnicity       TEXT,           -- 'group A' | 'group B' | 'group C' | 'group D' | 'group E'
  parental_education TEXT,        -- 'some high school' | 'high school' | 'some college' | 
                                  --  "associate's degree" | "bachelor's degree" | "master's degree"
  lunch           TEXT,           -- 'standard' | 'free/reduced'
  test_prep       TEXT,           -- 'completed' | 'none'
  math_score      INTEGER,        -- 0–100
  reading_score   INTEGER,        -- 0–100
  writing_score   INTEGER,        -- 0–100
  pass_math       INTEGER         -- 1 si math_score >= 60, 0 si no
);
```

### Cómo se crea la columna `pass_math` (desde Cursor con MCP de Supabase)
```sql
ALTER TABLE students ADD COLUMN pass_math INTEGER;
UPDATE students SET pass_math = CASE WHEN math_score >= 60 THEN 1 ELSE 0 END;
```

---

## 5. Navegación y Layout Global

### Estructura de navegación
```
EduInsights
├── 📊 Dashboard          /
├── 🔍 Explorador         /explorer
└── 🤖 Predictor ML       /predictor
```

### Layout global
La app tiene un **sidebar fijo izquierdo** de 240px con navegación vertical. El contenido principal ocupa el resto del ancho. En mobile (< 768px), el sidebar colapsa a un menú hamburguesa en la parte superior.

**Header del sidebar:**
- Logo: ícono de gráfica de barras + texto "EduInsights" en blanco, font-weight 700
- Versión debajo: "v1.0" en gris claro, font-size 11px

**Items del sidebar:**
- Ícono + Label
- Estado activo: pill de fondo índigo
- Estado hover: fondo semitransparente blanco al 10%

**Footer del sidebar:**
- Texto: "Datos: Students Performance Dataset"
- Font-size 11px, color gris claro
- Link a Kaggle

---

## 6. Pantalla 1 — Dashboard Principal

**Ruta:** `/`  
**Propósito:** Vista ejecutiva con métricas clave y gráficas de tendencias. Primera pantalla que ve el usuario al entrar.

### 6.1 Header de la pantalla
- Título: "Dashboard de Rendimiento" — H1, `#1E293B`
- Subtítulo: "Análisis general del dataset de 1,000 estudiantes" — body, `#64748B`
- Posición: top-left del área de contenido, padding-top 32px

### 6.2 Sección KPI Cards

**Layout:** Fila de 4 cards en grid de 4 columnas. En tablet (768–1024px): 2 columnas. En mobile: 1 columna.

**Separación entre cards:** 16px gap.

#### Card 1 — Promedio General de Matemáticas
- Ícono: 📐 (o ícono de calculadora)
- Label: "Promedio Matemáticas"
- Valor principal: promedio de `math_score` — 36px, bold, `#1E293B`
- Subtítulo: "sobre 100 puntos"
- Sin indicador de tendencia

#### Card 2 — Tasa de Aprobación
- Ícono: ✅
- Label: "Tasa de Aprobación"
- Valor principal: porcentaje de `pass_math = 1` — 36px, bold
- Color del valor: verde `#10B981` si > 60%, rojo `#EF4444` si ≤ 60%
- Subtítulo: "estudiantes con score ≥ 60"

#### Card 3 — Impacto del Curso de Preparación
- Ícono: 📚
- Label: "Mejora con Prep Course"
- Valor principal: diferencia en promedio de math_score entre quienes completaron vs no — mostrar como "+X pts"
- Color del valor: siempre verde (es un delta positivo)
- Subtítulo: "vs estudiantes sin preparación"

#### Card 4 — Total de Estudiantes
- Ícono: 👥
- Label: "Total Estudiantes"
- Valor principal: COUNT total — 36px, bold, `#1E293B`
- Subtítulo: "en el dataset"

### 6.3 Sección de Gráficas — Fila 1

**Layout:** 2 columnas de igual ancho. Gap: 16px. Margin-top: 24px desde las KPI cards.

#### Gráfica 1 — Promedio por Nivel Educativo de los Padres (Barra Horizontal)
- **Tipo:** Bar Chart horizontal (Recharts `BarChart` con `layout="vertical"`)
- **Título de card:** "Rendimiento por Educación Familiar"
- **Subtítulo:** "Promedio de math_score agrupado por nivel educativo de los padres"
- **Eje Y (categorías):** valores de `parental_education` — abreviados si son largos
- **Eje X (valores):** promedio de `math_score`, rango 0–100
- **Color de barras:** `#4F46E5`
- **Altura del chart:** 280px
- **Tooltip:** muestra label completo + promedio exacto

#### Gráfica 2 — Distribución de Scores por Materia (Barras Agrupadas)
- **Tipo:** Grouped Bar Chart (Recharts `BarChart` con múltiples `Bar`)
- **Título de card:** "Comparación de Scores por Materia"
- **Subtítulo:** "Promedio de math, reading y writing por género"
- **Eje X:** `gender` (male / female)
- **Eje Y:** promedio de score (0–100)
- **Barras:** 3 barras por grupo — Math `#4F46E5`, Reading `#10B981`, Writing `#F59E0B`
- **Leyenda:** debajo del chart
- **Altura:** 280px

### 6.4 Sección de Gráficas — Fila 2

**Layout:** Columna izquierda 60% + columna derecha 40%. Gap: 16px. Margin-top: 16px.

#### Gráfica 3 — Impacto del Curso de Preparación (Scatter Plot)
- **Tipo:** Scatter Chart (Recharts `ScatterChart`)
- **Título de card:** "Reading vs Writing Score"
- **Subtítulo:** "Coloreado por completar curso de preparación"
- **Eje X:** `reading_score`
- **Eje Y:** `writing_score`
- **Colores:** Completado `#4F46E5`, No completado `#94A3B8`
- **Leyenda:** arriba del chart, alineada a la derecha
- **Altura:** 280px
- **Tooltip:** muestra los dos scores + si completó prep

#### Gráfica 4 — Distribución por Grupo Étnico (Pie Chart)
- **Tipo:** Pie Chart con Donut (Recharts `PieChart` con `innerRadius`)
- **Título de card:** "Distribución por Grupo Étnico"
- **Subtítulo:** "Porcentaje de estudiantes por grupo"
- **Data:** COUNT de estudiantes por `ethnicity`
- **Colores:** paleta de 5 colores índigo definida en sección 2
- **Centro del donut:** texto "1,000\nalumnos"
- **Leyenda:** a la derecha del donut, lista vertical con color + label + porcentaje
- **Altura:** 280px

### 6.5 Estados de la Pantalla

| Estado | Comportamiento |
|--------|---------------|
| **Loading** | Skeleton loaders en lugar de cards y gráficas — rectángulos grises animados con pulse |
| **Error de conexión** | Banner rojo en la parte superior: "No se pudo conectar con la base de datos. Verifica tu configuración." + botón "Reintentar" |
| **Sin datos** | Ilustración centrada con texto: "No hay datos disponibles. Carga el dataset para comenzar." |

---

## 7. Pantalla 2 — Explorador de Datos

**Ruta:** `/explorer`  
**Propósito:** Permite explorar el dataset crudo con filtros y descargar los datos filtrados como CSV.

### 7.1 Header
- Título: "Explorador de Datos" — H1
- Subtítulo: "Filtra, ordena y exporta el dataset completo" — body, `#64748B`

### 7.2 Barra de Filtros

**Layout:** Fila horizontal con filtros en línea. En mobile: columna vertical. Card de fondo blanco, padding 20px, border-radius 12px, borde.

#### Filtro 1 — Género
- **Tipo:** Dropdown select
- **Label:** "Género"
- **Opciones:** Todos, Male, Female
- **Default:** Todos

#### Filtro 2 — Educación de los Padres
- **Tipo:** Dropdown select
- **Label:** "Educación Parental"
- **Opciones:** Todos + los 6 niveles del dataset
- **Default:** Todos

#### Filtro 3 — Curso de Preparación
- **Tipo:** Dropdown select
- **Label:** "Curso de Prep."
- **Opciones:** Todos, Completado, No completado
- **Default:** Todos

#### Filtro 4 — Rango de Score de Matemáticas
- **Tipo:** Dos inputs numéricos (Min – Max)
- **Label:** "Math Score"
- **Default:** 0 – 100

#### Filtro 5 — Resultado
- **Tipo:** Dropdown select
- **Label:** "Resultado"
- **Opciones:** Todos, Aprobó (pass_math=1), Reprobó (pass_math=0)

**Botón "Aplicar Filtros"** — primario, derecha de la barra  
**Botón "Limpiar"** — secundario, junto al anterior

### 7.3 Resumen de Resultados
- Texto debajo de la barra de filtros: "Mostrando **X** de **1,000** estudiantes"
- Font-size 13px, `#64748B`
- El número X en bold y `#4F46E5`

### 7.4 Tabla de Datos

**Layout:** Card de fondo blanco con la tabla dentro, scroll horizontal en mobile.

**Columnas:**

| Columna | Key | Tipo | Ordenable |
|---------|-----|------|-----------|
| # | id | Número | Sí |
| Género | gender | Badge (Male=azul, Female=rosa) | Sí |
| Grupo | ethnicity | Texto | Sí |
| Educ. Parental | parental_education | Texto | Sí |
| Almuerzo | lunch | Badge (standard=verde, free/reduced=gris) | No |
| Curso Prep. | test_prep | Badge (completed=verde, none=gris) | Sí |
| Matemáticas | math_score | Número + barra de progreso mini | Sí |
| Lectura | reading_score | Número + barra de progreso mini | Sí |
| Escritura | writing_score | Número + barra de progreso mini | Sí |
| Resultado | pass_math | Badge grande (Aprobó=verde, Reprobó=rojo) | Sí |

**Barra de progreso mini:** debajo del número de score, ancho proporcional al valor (100% = 100pts), color `#4F46E5`, height 3px, border-radius 2px.

**Paginación:**
- Debajo de la tabla, centrada
- Botones: ← Anterior / Siguiente →
- Selector de "Filas por página": 10, 25, 50
- Texto: "Página X de Y"
- Estilo: minimal, solo números y flechas

**Ordenamiento:**
- Click en header de columna ordenable activa sort ascendente
- Segundo click: descendente
- Tercer click: sin orden
- Indicador visual: flecha ↑ ↓ junto al label del header

### 7.5 Barra de Acciones (sobre la tabla)
- **Izquierda:** título "Resultados" + badge con count
- **Derecha:** botón "⬇ Exportar CSV" — secundario, descarga los datos filtrados actuales

### 7.6 Estados

| Estado | Comportamiento |
|--------|---------------|
| **Loading** | Skeleton de tabla: 10 filas de barras grises animadas |
| **Sin resultados** | Celda única con texto centrado: "Ningún estudiante coincide con los filtros aplicados." + botón "Limpiar filtros" |
| **Error** | Mensaje de error con botón reintentar |

---

## 8. Pantalla 3 — Predictor ML

**Ruta:** `/predictor`  
**Propósito:** Permite ingresar las características de un estudiante y obtener una predicción sobre si aprobará matemáticas, consultando el modelo de ML desplegado en Render.

### 8.1 Header
- Título: "Predictor de Rendimiento" — H1
- Subtítulo: "Ingresa los datos del estudiante para predecir si aprobará matemáticas" — body, `#64748B`

### 8.2 Layout de la Pantalla
**2 columnas:** Formulario (izquierda, 45%) + Panel de resultado + Historial (derecha, 55%)

En tablet/mobile: columna única, formulario arriba, resultado abajo.

### 8.3 Panel Izquierdo — Formulario de Predicción

**Card** con título "Datos del Estudiante", ícono 🎓.

#### Campos del formulario

**Campo 1 — Género**
- Tipo: Radio buttons estilizados como pill buttons (no radio tradicional)
- Opciones: "Masculino" | "Femenino"
- Seleccionado: fondo `#4F46E5`, texto blanco
- No seleccionado: borde gris, texto oscuro

**Campo 2 — Grupo Étnico**
- Tipo: Dropdown select
- Opciones: Group A, Group B, Group C, Group D, Group E
- Label: "Grupo Étnico"

**Campo 3 — Educación de los Padres**
- Tipo: Dropdown select
- Opciones: los 6 niveles
- Label: "Nivel Educativo de los Padres"

**Campo 4 — Tipo de Almuerzo**
- Tipo: Radio buttons pill (igual estilo que género)
- Opciones: "Estándar" | "Subsidiado"
- Label: "Tipo de Almuerzo"
- Tooltip ℹ️ al lado: "Indicador de nivel socioeconómico"

**Campo 5 — Curso de Preparación**
- Tipo: Toggle switch
- Label: "Completó Curso de Preparación"
- ON = completado (verde), OFF = no completado

**Campo 6 — Score de Lectura**
- Tipo: Input numérico + Slider
- Rango: 0–100
- Label: "Score de Lectura"
- El input y el slider están sincronizados

**Campo 7 — Score de Escritura**
- Tipo: Input numérico + Slider  
- Rango: 0–100
- Label: "Score de Escritura"
- El input y el slider están sincronizados

**Botón "Predecir"** — primario, ancho completo, font-size 16px, padding 14px
- Estado loading: spinner + texto "Analizando..."
- Estado normal: ícono ▶ + texto "Predecir Resultado"

**Botón "Limpiar"** — secundario, ancho completo, debajo del anterior

### 8.4 Panel Derecho — Resultado de la Predicción

#### Estado vacío (sin predicción aún)
- Ilustración centrada (ícono grande de gráfica o cerebro, outline estilo `#CBD5E1`)
- Texto: "Completa el formulario y presiona Predecir para ver el resultado"
- Font-size 14px, `#94A3B8`, texto centrado

#### Estado loading
- Spinner de `#4F46E5` centrado
- Texto: "Consultando el modelo..."

#### Estado con resultado — Aprueba
- Card con borde izquierdo grueso de `#10B981` (4px)
- Badge grande: "✅ APRUEBA" — fondo verde claro, texto verde oscuro, font-size 18px, bold
- Texto debajo: "El modelo predice que este estudiante aprobará matemáticas"
- **Barra de confianza:**
  - Label: "Confianza del modelo"
  - Barra de progreso ancha, color verde, valor = probabilidad del modelo (ej. 82%)
  - Texto del porcentaje a la derecha

#### Estado con resultado — Reprueba
- Card con borde izquierdo grueso de `#EF4444`
- Badge grande: "⚠️ EN RIESGO" — fondo rojo claro, texto rojo oscuro
- Texto debajo: "El modelo predice que este estudiante podría reprobar matemáticas"
- **Barra de confianza:** igual estructura, color rojo

#### Sección de factores clave (debajo del resultado)
- Título: "Factores considerados"
- Lista de los 3 features más importantes para esta predicción específica (si el modelo los expone)
- Si no están disponibles: lista estática de los features del formulario

### 8.5 Historial de Predicciones (parte baja del panel derecho)

**Card** con título "Últimas Predicciones" (máximo 5 en sesión)

Cada item del historial:
- Fila con: timestamp (HH:MM) + resumen de inputs clave + badge de resultado (Aprueba/Reprueba) + confianza
- Separador entre items
- Si no hay historial: texto "Las predicciones de esta sesión aparecerán aquí"

### 8.6 Sección informativa (debajo del formulario y resultado)

**Card de ancho completo** con fondo `#EEF2FF` (índigo muy claro), borde `#C7D2FE`.

- Título: "ℹ️ ¿Cómo funciona este modelo?"
- Párrafo explicativo: "Este predictor usa un modelo de Random Forest entrenado con datos de 1,000 estudiantes. Analiza 7 características para estimar la probabilidad de aprobar matemáticas (score ≥ 60). La confianza indica qué tan seguro está el modelo — valores sobre 75% son considerados confiables."
- Font-size 13px, `#4338CA`

### 8.7 Estados de la Pantalla

| Estado | Comportamiento |
|--------|---------------|
| **API no disponible** | Banner amarillo en la parte superior: "El servicio de predicción no está disponible en este momento." |
| **Error de predicción** | Mensaje de error en el panel de resultado con botón "Intentar de nuevo" |
| **Formulario incompleto** | Validación inline: borde rojo en campo faltante + mensaje debajo |

---

## 9. Contratos de API

### 9.1 Supabase — Queries principales

**Dashboard — Promedio por educación parental:**
```
GET /rest/v1/students
?select=parental_education,math_score
Headers: apikey, Authorization
→ Agregar en frontend con groupBy()
```

**Dashboard — Datos para scatter (todos los records):**
```
GET /rest/v1/students
?select=reading_score,writing_score,test_prep
```

**Explorador — Con filtros:**
```
GET /rest/v1/students
?select=*
&gender=eq.female          (ejemplo de filtro)
&math_score=gte.60         (ejemplo de rango)
&order=math_score.desc
&limit=25
&offset=0
```

### 9.2 ML API — Endpoint de predicción

**POST** `[VITE_ML_API_URL]/predict`

**Request body:**
```json
{
  "gender": "female",
  "ethnicity": "group C",
  "parental_education": "bachelor's degree",
  "lunch": "standard",
  "test_prep": "completed",
  "reading_score": 72,
  "writing_score": 68
}
```

**Response exitosa (200):**
```json
{
  "prediction": 1,
  "label": "Aprueba",
  "confidence": 0.82,
  "probabilities": {
    "pass": 0.82,
    "fail": 0.18
  }
}
```

**Response de error (503):**
```json
{
  "error": "Model not loaded",
  "message": "El modelo de ML no está disponible en este momento"
}
```

**GET** `[VITE_ML_API_URL]/health`
```json
{ "status": "ok", "model_loaded": true }
```

---

## 10. Flujo de Diseño: Stitch → Figma → Cursor

> **Esta sección explica el proceso de diseño que seguirás. Léela antes de abrir Stitch.**

### Paso 1 — Generar el diseño en Stitch (Google)

Stitch es una herramienta de Google que genera interfaces de alta fidelidad a partir de descripciones en lenguaje natural. Para cada pantalla, crea un prompt que incluya:

1. El nombre y propósito de la pantalla (sección 6, 7 u 8 de este PRD)
2. Los colores exactos de la sección 2 (copia la tabla completa)
3. La tipografía (Inter, tamaños de la sección 2)
4. La descripción detallada de cada componente de la pantalla

**Prompt ejemplo para Stitch — Dashboard:**
```
Design a data analytics dashboard called "EduInsights" with the following specs:
- Font: Inter. Background: #F8FAFC. Cards: white, 12px border-radius, subtle shadow.
- Sidebar: dark #1E293B, 240px wide, with logo and 3 navigation items.
- Top section: 4 KPI cards in a row showing: Math Average (large number, gray), 
  Approval Rate (green if >60%), Prep Course Impact (+X pts in green), Total Students.
- Bottom section: 2-column chart grid with a horizontal bar chart and a grouped bar chart.
- Primary color: #4F46E5. Success: #10B981. Style: clean, professional, corporate dashboard.
```

### Paso 2 — Iterar en Stitch
- Revisa el resultado y pide ajustes específicos en lenguaje natural
- Asegúrate de que la paleta, tipografía y espaciado estén correctos
- Genera las 3 pantallas por separado

### Paso 3 — Exportar a Figma
- Desde Stitch, exporta el diseño a Figma con el botón "Open in Figma"
- En Figma, organiza las pantallas en frames separados: `Dashboard`, `Explorer`, `Predictor`
- Verifica que los estilos (colores, fuentes) estén definidos como variables de Figma

### Paso 4 — Pasar diseño a Cursor via MCP de Figma
- Instala el MCP de Figma en Cursor (plugin oficial de Figma para Cursor)
- Conecta tu archivo de Figma al proyecto
- En el chat de Cursor, referencia los frames por nombre:

```
Implementa el componente Dashboard.jsx exactamente como se ve en el frame 
"Dashboard" de Figma. Usa Recharts para las gráficas y CSS Modules para estilos. 
Los datos deben venir del hook useSupabase con la tabla 'students'.
```

### Paso 5 — Integrar APIs después del diseño
- Primero implementa el diseño estático (mock data)
- Verifica que se vea igual al diseño de Figma
- Luego reemplaza mock data con llamadas reales a Supabase
- Por último integra el endpoint del modelo de ML en la pantalla Predictor

---

## 11. Checklist de Desarrollo

### Diseño
- [ ] Dashboard diseñado en Stitch
- [ ] Explorador diseñado en Stitch
- [ ] Predictor diseñado en Stitch
- [ ] Los 3 diseños exportados a Figma
- [ ] Estilos definidos como variables en Figma

### Frontend (Cursor + MCP Figma)
- [ ] Proyecto base creado (cursor-supabase-app)
- [ ] MCP de Supabase configurado en `.cursor/mcp.json`
- [ ] Dashboard implementado con mock data
- [ ] Explorador implementado con mock data
- [ ] Predictor implementado con mock data
- [ ] Diseño validado contra Figma (pixel-accurate)

### Backend
- [ ] Proyecto creado en Supabase
- [ ] CSV de students cargado
- [ ] Columna `pass_math` creada via SQL en Cursor (MCP)
- [ ] Modelo entrenado (`train.py` ejecutado)
- [ ] `model.pkl` generado
- [ ] FastAPI desplegada en Render

### Integración
- [ ] Dashboard conectado a Supabase
- [ ] Explorador conectado a Supabase con filtros funcionales
- [ ] Predictor conectado al endpoint de ML
- [ ] Variables de entorno configuradas en Vercel

### Deploy
- [ ] Frontend desplegado en Vercel
- [ ] URL pública funcionando
- [ ] Todos los integrantes del equipo pueden acceder