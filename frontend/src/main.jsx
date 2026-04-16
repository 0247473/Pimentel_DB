/**
 * Frontend entry point.
 * Purpose: Mounts the React app into the DOM.
 * Modify: Add providers (e.g. auth, theme) here.
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
