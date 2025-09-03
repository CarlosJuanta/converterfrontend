// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // <-- Importamos el enrutador
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Envolvemos nuestra App en BrowserRouter para activar las rutas */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)