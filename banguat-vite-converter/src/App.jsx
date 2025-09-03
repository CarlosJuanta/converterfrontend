// src/App.jsx
import { useState, useEffect } from 'react'; // <-- Importamos useEffect
import ExchangeConverter from './ExchangeConverter';
import Login from './Login';


// Reutilizamos la variable de entorno aquí también
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://converterbackend-vv81.onrender.com'
  : 'http://localhost:3000';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // 1. Añadimos un nuevo estado para saber si la verificación inicial ya terminó.
  const [isLoading, setIsLoading] =  useState(true);

  // 2. Usamos useEffect para que se ejecute solo una vez cuando la app carga.
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // 3. Intentamos llamar a nuestra nueva ruta de verificación.
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/verify`, {
          credentials: 'include', // ¡Esencial para enviar la cookie!
        });

        // 4. Si la respuesta es OK (200), significa que la cookie es válida.
        if (response.ok) {
          setIsAuthenticated(true); // Marcamos al usuario como autenticado.
        }
        // Si no es OK (ej. 401), no hacemos nada, 'isAuthenticated' seguirá en false.

      } catch (error) {
        // Si hay un error de red, asumimos que no está autenticado.
        console.error("Error al verificar la autenticación:", error);
      } finally {
        // 5. Haya funcionado o no, la carga inicial ha terminado.
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []); // El array vacío asegura que se ejecute solo una vez.


  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

 //-----------------INICIO DE LA MODIFICACIÓN ------------------
 //Se crea la función para manejar el cierre de sesión

 const handleLogout =() => {
  setIsAuthenticated(false);
 }


  // 6. Mientras estamos verificando, mostramos un mensaje de "Cargando...".
  if (isLoading) {
    return <div>Verificando sesión...</div>;
  }

  // 7. Una vez que la carga termina, usamos la misma lógica de antes.
  return (
    <>
      {isAuthenticated ? (
        <ExchangeConverter onLogout={handleLogout} />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
}

export default App;