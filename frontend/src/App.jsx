/**
 * App - Root component with routing.
 * Purpose: Sets up React Router and layout.
 * Modify: Add auth guards, error boundaries, or global providers.
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Dashboard from './pages/Dashboard'
import DataExplorer from './pages/DataExplorer'
import Predictor from './pages/Predictor'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ padding: '1.5rem', maxWidth: 1400, margin: '0 auto' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/explorer" element={<DataExplorer />} />
          <Route path="/predictor" element={<Predictor />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
