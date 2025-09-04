import React, {useState} from 'react';
import { Link, useNavigate} from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL;

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // Para mostrar un mensaje de éxito
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Para redirigir al usuario

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error desconocido al registrar.');
      }
      
      setSuccess("¡Registro exitoso! Serás redirigido al login...");
      
      // Esperamos un par de segundos y luego lo enviamos al login
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
    // No ponemos setIsLoading(false) en el caso de éxito porque redirigimos
  }


return (
    <div style ={styles.container}>
     <h1 style={styles.title}>Crear una Cuenta</h1>
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
          />
        </div>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
        <button type="submit" style={styles.button} disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
      <p style={styles.linkText}>
        ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
      </p>
    </div>
);
}

// Usamos los mismos estilos del Login para mantener la consistencia
const styles = {
    container: { fontFamily: 'Arial, sans-serif', maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center', backgroundColor:'#edf1edff' },
    title: { color: '#333', fontSize: '24px' },
    inputGroup: { marginBottom: '15px', textAlign: 'left' },
    label: { display: 'block', marginBottom: '5px', color: '#555' },
    input: { width: 'calc(100% - 22px)', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' },
    button: { width: '100%', padding: '10px', border: 'none', borderRadius: '4px', backgroundColor: '#28a745', color: 'white', fontSize: '16px', cursor: 'pointer' },
    error: { color: 'red', marginTop: '10px' },
    success: { color: 'green', marginTop: '10px' },
    linkText: { marginTop: '20px' } 

    
};

export default Register;