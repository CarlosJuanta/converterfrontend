// src/WarningModal.jsx
import React, { useState, useEffect } from 'react';

function WarningModal({ onExtend, onLogout, countdownStart }) {
  const [countdown, setCountdown] = useState(countdownStart);

  useEffect(() => {
    // Inicia un intervalo que se ejecuta cada segundo
    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    // Limpia el intervalo cuando el componente se desmonte
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>¿Deseas seguir navegando?</h2>
        <p>Tu sesión se cerrará automáticamente en</p>
        <p style={styles.countdown}>{countdown} segundos</p>
        <button onClick={onExtend} style={styles.button}>Sí, continuar</button>
        <button onClick={onLogout} style={{...styles.button, ...styles.logoutButton}}>No, cerrar sesión</button>
      </div>
    </div>
  );
}

// (Estilos para el modal, puedes personalizarlos)
const styles = {
  overlay: {
    position: 'fixed', // Se queda fijo en la pantalla, incluso al hacer scroll
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fondo semitransparente
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Se asegura de que esté por encima de todo lo demás
  },
  modal: {
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
    maxWidth: '450px',
    width: '90%',
    fontFamily: 'Arial, sans-serif',
  },
  countdown: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#dc3545', // Un rojo para indicar urgencia
    margin: '10px 0',
  },
  button: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    margin: '10px',
    minWidth: '150px',
    transition: 'background-color 0.2s ease', // Efecto suave al pasar el ratón
    backgroundColor: '#007bff', // Azul primario para la acción principal
    color: 'white',
  },
  logoutButton: {
    backgroundColor: '#6c757d', // Un color secundario para la otra opción
  }
};
export default WarningModal;