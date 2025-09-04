// src/Login.jsx
import React, { useState } from 'react';
import {Link} from 'react-router-dom';

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://conversor-jwt.onrender.com'
  : 'http://localhost:3000';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error desconocido al iniciar sesión.');
      }
      
      // Si el login es exitoso, llamamos a la función del padre
      // y le pasamos el timestamp de expiración que nos dio el backend.
      if (data.expiresAt) {
        onLoginSuccess(data.expiresAt);
      } else {
        throw new Error("La respuesta del servidor no incluyó la fecha de expiración.");
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Iniciar Sesión</h1>
      <form onSubmit={handleSubmit}>
        <div style={styles.inputGroup}>
      
          <input
            id="username"
            type="text" 
            placeholder='Usuario'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
            disabled={isLoading}
          />
        </div>
        <div style={styles.inputGroup}>
         
          <input
            id="password"
            type="password"
            placeholder='Contraseña'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
            disabled={isLoading}
          />
        </div>
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button} disabled={isLoading}>
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
      </form> 
      {/* AÑADIR EL PÁRRAFO CON EL ENLACE*/}
      <p style={styles.linkText}>
        ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
      </p>
    </div>
  );
}

const styles = {
    container: { fontFamily: 'Arial, sans-serif', maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center', backgroundColor: '#eff6fdff' },
    title: { color: '#333', fontSize: '24px' },
    inputGroup: { marginBottom: '15px', textAlign: 'left' },
    label: { display: 'block', marginBottom: '5px', color: '#555' },
    input: { width: 'calc(100% - 22px)', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' },
    button: { width: '100%', padding: '10px', border: 'none', borderRadius: '4px', backgroundColor: '#007bff', color: 'white', fontSize: '16px', cursor: 'pointer' },
    error: { color: 'red', marginTop: '10px' },
};

export default Login;