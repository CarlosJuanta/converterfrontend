// src/App.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import ExchangeConverter from './ExchangeConverter';
import Login from './Login';
import Register from './Register'; //importar nuevo componente
import WarningModal from './WarningModal';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_URL;
// ===================================================================
// COMPONENTE "GUARDIA DE SEGURIDAD" PARA LAS RUTAS
// ===================================================================
function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    // Si el usuario no está autenticado, lo redirigimos a /login
    return <Navigate to="/login" replace />;
  }
  // Si está autenticado, mostramos el componente que se quería renderizar
  return children;
}
 
// ===== INICIO DE LA MODIFICACIÓN #1 =====
// Este es nuestro nuevo "Guardia" para rutas públicas
function GuestRoute({ isAuthenticated, children }) {
  if (isAuthenticated) {
    // Si el usuario YA está autenticado, lo redirigimos a la página principal
    return <Navigate to="/conversor" replace />;
  }
  // Si no está autenticado, le permitimos ver la página (Login, Register)
  return children;
}
// ===== FIN DE LA MODIFICACIÓN #1 =====


// ===================================================================
// COMPONENTE PRINCIPAL DE LA APLICACIÓN
// ===================================================================
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const navigate = useNavigate(); // Hook para la navegación

  const sessionTimeout = useRef();
  const warningTimeout = useRef();

  const handleLogout = useCallback(async () => {
    clearTimeout(sessionTimeout.current);
    clearTimeout(warningTimeout.current);
    setShowWarning(false);
    setIsAuthenticated(false);
    try {
      await fetch(`${API_BASE_URL}/api/v1/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch (error) {
      console.error("Error en logout:", error);
    }
    navigate('/login'); // Redirigimos al login
  }, [navigate]);

  const setupTimers = (expiresAt) => {
    clearTimeout(sessionTimeout.current);
    clearTimeout(warningTimeout.current);

    const timeLeft = expiresAt - Date.now();
    const warningTime = timeLeft - 30 * 1000;

    if (warningTime > 0) {
      warningTimeout.current = setTimeout(() => setShowWarning(true), warningTime);
    }
    sessionTimeout.current = setTimeout(handleLogout, timeLeft);
  };

  const handleExtendSession = async () => {
    setShowWarning(false);
    try {
      await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, { method: 'POST', credentials: 'include' });
      const newExpiresAt = Date.now() + (3 * 60 * 1000);
      setupTimers(newExpiresAt);
    } catch (error) {
      handleLogout();
    }
  };

  const handleLoginSuccess = (expiresAt) => {
    setIsAuthenticated(true);
    setupTimers(expiresAt);
    navigate('/conversor'); // Redirigimos al conversor
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/verify`, { credentials: 'include' });
        if (response.ok) {
          setIsAuthenticated(true);
          // Opcional: Modificar /verify para que devuelva el expiresAt
          // y llamar a setupTimers() aquí también para que el timer
          // funcione incluso después de recargar la página.
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  if (isLoading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando aplicación...</div>;
  }

  return (
    <>
      {/* El modal de advertencia vive fuera del sistema de rutas para poder superponerse a todo */}
      {showWarning && <WarningModal onExtend={handleExtendSession} onLogout={handleLogout} countdownStart={30} />}
      
      <Routes> 


       {/* ===== INICIO DE LA MODIFICACIÓN #2 ===== */}
        {/* Ahora las rutas de login y registro están protegidas por GuestRoute */}
        <Route
          path="/login"
          element={
            <GuestRoute isAuthenticated={isAuthenticated}>
              <Login onLoginSuccess={handleLoginSuccess} />
            </GuestRoute>
          }
        />
        
        <Route
          path="/register"
          element={
            <GuestRoute isAuthenticated={isAuthenticated}>
              <Register />
            </GuestRoute>
          }
        />
        {/* ===== FIN DE LA MODIFICACIÓN #2 ===== */}
        
        
        <Route
          path="/conversor"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ExchangeConverter onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        
        {/* Redirección por defecto */}
        <Route
          path="*"
          element={<Navigate to="/conversor" replace />}
        />
      </Routes>
    </>
  );
}

export default App;