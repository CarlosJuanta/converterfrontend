import React, {useState} from 'react';

// Se reutiliza la misma variable de entorno para la URL del backend
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://converterbackend-vv81.onrender.com'
  : 'http://localhost:3000';


  function Login ({onLoginSuccess}) {
     const [username, setUsername] = useState ('');
     const [password, setPassword] = useState ('');
     const [error, setError] = useState (null);


     const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
        const response = await fetch (`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST' ,
        headers : {
            'Content-type' : 'application/json',
        },
        body: JSON.stringify({ username, password}),
        // ¡¡ESTA LÍNEA ES LA MÁS IMPORTANTE PARA LA AUTENTICACIÓN!!
        // Le dice al navegador que envíe las cookies que reciba del backend.
        credentials: 'include',
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al iniciar sesión.' );
        }
          
         // Si el login es exitoso, llamamos a la función que nos pasó el padre (App.jsx)
      onLoginSuccess();

        } catch (err) {
            setError(err.message);
        }
     };


     return (
      <div style={styles.container}>
      <h1 style={styles.title}>Iniciar Sesión</h1>
      <form onSubmit={handleSubmit}>
        <div style={styles.inputGroup}>
          <label htmlFor="username" style={styles.label}>Usuario:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="password" style={styles.label}>Contraseña:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button}>Entrar</button>
      </form>
    </div>
  );
    

  } 


  // Estilos para el componente (puedes personalizarlos)
const styles = {
    container: { fontFamily: 'Arial, sans-serif', maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' },
    title: { color: '#333', fontSize: '24px' },
    inputGroup: { marginBottom: '15px', textAlign: 'left' },
    label: { display: 'block', marginBottom: '5px', color: '#555' },
    input: { width: 'calc(100% - 22px)', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' },
    button: { width: '100%', padding: '10px', border: 'none', borderRadius: '4px', backgroundColor: '#007bff', color: 'white', fontSize: '16px', cursor: 'pointer' },
    error: { color: 'red', marginTop: '10px' },
};

export default Login;