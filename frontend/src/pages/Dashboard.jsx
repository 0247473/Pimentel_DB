/**
 * Dashboard - EduInsights main dashboard page.
 * Purpose: Executive overview with KPIs and charts as defined in the PRD.
 * Note: Uses mock data until Supabase is connected.
 */
import { BarChartWidget, PieChartWidget, ScatterChartWidget } from '../components/charts'
import KpiCard from '../components/ui/KpiCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import styles from './Dashboard.module.css'

// const { data, loading, error } = useSupabase('students') will replace mocks later.

const MOCK_TOTAL_STUDENTS = 1000
const MOCK_AVG_MATH = 66.4
const MOCK_PASS_RATE = 0.65
const MOCK_PREP_DELTA = 8.2

const MOCK_KPIS = [
  {
    title: 'Promedio Matemáticas',
    value: `${MOCK_AVG_MATH.toFixed(1)}`,
    subtitle: 'sobre 100 puntos',
    icon: '📐',
  },
  {
    title: 'Tasa de Aprobación',
    value: `${Math.round(MOCK_PASS_RATE * 100)}%`,
    subtitle: 'estudiantes con score ≥ 60',
    icon: '✅',
    color: MOCK_PASS_RATE > 0.6 ? 'success' : 'danger',
  },
  {
    title: 'Mejora con Prep Course',
    value: `+${MOCK_PREP_DELTA.toFixed(1)} pts`,
    subtitle: 'vs estudiantes sin preparación',
    icon: '📚',
    color: 'success',
  },
  {
    title: 'Total Estudiantes',
    value: MOCK_TOTAL_STUDENTS.toLocaleString('es-ES'),
    subtitle: 'en el dataset',
    icon: '👥',
  },
]

// Mock aggregates aligned with PRD visualizations
const MOCK_PARENTAL_EDU = [
  { parental_education: "some high school", avg_math_score: 60 },
  { parental_education: 'high school', avg_math_score: 62 },
  { parental_education: 'some college', avg_math_score: 65 },
  { parental_education: "associate's degree", avg_math_score: 67 },
  { parental_education: "bachelor's degree", avg_math_score: 70 },
  { parental_education: "master's degree", avg_math_score: 73 },
]

const MOCK_GENDER_SUBJECTS = [
  { gender: 'female', math: 66, reading: 74, writing: 73 },
  { gender: 'male', math: 67, reading: 69, writing: 66 },
]

const MOCK_SCATTER_PREP = [
  { reading_score: 72, writing_score: 68, test_prep: 'completed' },
  { reading_score: 65, writing_score: 62, test_prep: 'completed' },
  { reading_score: 80, writing_score: 78, test_prep: 'completed' },
  { reading_score: 55, writing_score: 54, test_prep: 'none' },
  { reading_score: 60, writing_score: 58, test_prep: 'none' },
  { reading_score: 48, writing_score: 50, test_prep: 'none' },
]

const MOCK_ETHNICITY_DIST = [
  { ethnicity: 'group A', count: 190 },
  { ethnicity: 'group B', count: 200 },
  { ethnicity: 'group C', count: 210 },
  { ethnicity: 'group D', count: 190 },
  { ethnicity: 'group E', count: 210 },
]

export default function Dashboard() {
  const loading = false
  const error = null

  if (error) {
    return <div>Error al cargar datos: {error.message}</div>
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Dashboard de Rendimiento</h1>
        <p className={styles.subtitle}>Análisis general del dataset de 1,000 estudiantes</p>
      </header>

      <section className={styles.kpiGrid}>
        {MOCK_KPIS.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </section>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Fila 1: dos charts */}
          <section className={styles.chartsRow}>
            <div className={styles.chartCard}>
              <h2 className={styles.chartTitle}>Rendimiento por Educación Familiar</h2>
              <p className={styles.chartSubtitle}>
                Promedio de math_score agrupado por nivel educativo de los padres
              </p>
              <BarChartWidget
                data={MOCK_PARENTAL_EDU}
                xKey="parental_education"
                yKey="avg_math_score"
                layout="vertical"
                color="var(--color-primary)"
                height={280}
              />
            </div>

            <div className={styles.chartCard}>
              <h2 className={styles.chartTitle}>Comparación de Scores por Materia</h2>
              <p className={styles.chartSubtitle}>
                Promedio de math, reading y writing por género
              </p>
              <BarChartWidget
                data={MOCK_GENDER_SUBJECTS}
                xKey="gender"
                layout="horizontal"
                series={[
                  { dataKey: 'math', color: '#4f46e5', name: 'Math' },
                  { dataKey: 'reading', color: '#10b981', name: 'Reading' },
                  { dataKey: 'writing', color: '#f59e0b', name: 'Writing' },
                ]}
                height={280}
              />
            </div>
          </section>

          {/* Fila 2: 60/40 */}
          <section className={styles.chartsRowBottom}>
            <div className={styles.chartCard}>
              <h2 className={styles.chartTitle}>Reading vs Writing Score</h2>
              <p className={styles.chartSubtitle}>Coloreado por completar curso de preparación</p>
              <ScatterChartWidget
                data={MOCK_SCATTER_PREP}
                xKey="reading_score"
                yKey="writing_score"
                categoryKey="test_prep"
                series={[
                  { value: 'completed', color: '#4f46e5', name: 'Completó prep' },
                  { value: 'none', color: '#94a3b8', name: 'Sin prep' },
                ]}
                height={280}
              />
            </div>

            <div className={styles.chartCard}>
              <h2 className={styles.chartTitle}>Distribución por Grupo Étnico</h2>
              <p className={styles.chartSubtitle}>Porcentaje de estudiantes por grupo</p>
              <PieChartWidget
                data={MOCK_ETHNICITY_DIST}
                nameKey="ethnicity"
                valueKey="count"
                title=""
                height={280}
              />
            </div>
          </section>
        </>
      )}
    </div>
  )
}
