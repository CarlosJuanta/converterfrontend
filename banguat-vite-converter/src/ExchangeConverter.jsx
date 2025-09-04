// src/ExchangeConverter.jsx
import React, { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

function ExchangeConverter({onLogout}) {
    const [exchangeRateData, setExchangeRateData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quetzales, setQuetzales] = useState('');
    const [dollars, setDollars] = useState('');

    useEffect(() => {
        const fetchExchangeRate = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/tipo-cambio/dia`, {
                  credentials: 'include',
                });
                
                if (response.status === 401) {
                  throw new Error('Tu sesión ha expirado. Por favor, recarga la página e inicia sesión de nuevo.');
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const responseData = await response.json();

                if (responseData.success && responseData.data && typeof responseData.data.valor === 'number') {
                    setExchangeRateData(responseData.data);
                } else {
                    throw new Error('Formato de datos de tipo de cambio inesperado.');
                }

            } catch (e) {
                console.error("Error fetching exchange rate:", e);
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchExchangeRate();
    }, []); 



    //MODIFICACION 2 
    const handleLogoutClick = async () => {
        try{
            await fetch (`${API_BASE_URL}/api/v1/auth/logout`, {
                method: 'POST',
                credential: 'include',
            });
        } catch (error) {
            console.error("Error al cerrar sesión", error);
        } finally {
            onLogout();
        }
    };

    const getRate = () => exchangeRateData ? exchangeRateData.valor : null;

    const handleQuetzalesChange = (e) => {
        const qValue = e.target.value;
        setQuetzales(qValue);
        const rate = getRate();
        if (qValue === '' || isNaN(qValue) || rate === null) {
            setDollars('');
            return;
        }
        const qNum = parseFloat(qValue);
        const convertedDollars = qNum / rate;
        setDollars(convertedDollars.toFixed(2));
    };

    const handleDollarsChange = (e) => {
        const dValue = e.target.value;
        setDollars(dValue);
        const rate = getRate();
        if (dValue === '' || isNaN(dValue) || rate === null) {
            setQuetzales('');
            return;
        }
        const dNum = parseFloat(dValue);
        const convertedQuetzales = dNum * rate;
        setQuetzales(convertedQuetzales.toFixed(2));
    };

    if (loading) return <div style={styles.container}>Cargando tipo de cambio...</div>;
    if (error) return <div style={styles.container}><p style={styles.error}>{error}</p></div>;
    if (!exchangeRateData) return <div style={styles.container}><p style={styles.error}>Tipo de cambio no disponible.</p></div>;

    // ===================================================================
    // ===== INICIO DE LA CORRECCIÓN EN EL RETURN =====
    // ===================================================================
    return (
        <div style={styles.container}>  
           {/* ===== INICIO DE LA MODIFICACIÓN #3 ===== */}
            <button onClick={handleLogoutClick} style={styles.logoutButton}>
                Cerrar Sesión
            </button>
            {/* ===== FIN DE LA MODIFICACIÓN #3 ===== */}
          
            <h1 style={styles.title}>Conversor de Quetzales a Dólares</h1>
            {/* Aquí se quitaron los tres puntos '...' antes de styles */}
            <p style={styles.exchangeRateInfo}>
                Tipo de cambio del día ({exchangeRateData.fecha}):
                <br />
                1 USD = {exchangeRateData.valor.toFixed(4)} GTQ
            </p>

            <div style={styles.inputGroup}>
                <label htmlFor="quetzales" style={styles.label}>Quetzales (GTQ):</label>
                <input
                    id="quetzales"
                    type="number"
                    value={quetzales}
                    onChange={handleQuetzalesChange}
                    placeholder="Ingrese Quetzales"
                    style={styles.input}
                />
            </div>

            <div style={styles.inputGroup}>
                <label htmlFor="dollars" style={styles.label}>Dólares (USD):</label>
                <input
                    id="dollars"
                    type="number"
                    value={dollars}
                    onChange={handleDollarsChange}
                    placeholder="Ingrese Dólares"
                    style={styles.input}
                />
            </div>
        </div>
    );
    // ===================================================================
    // ===== FIN DE LA CORRECCIÓN EN EL RETURN =====
    // ===================================================================
}

// (Los estilos no cambian)
const styles = {
    container: { fontFamily: 'Arial, sans-serif', maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', backgroundColor: '#f9f9f9', textAlign: 'center' },
    title: { color: '#333', fontSize: '24px', marginBottom: '20px' },
    logoutButton: {
        position: 'absolute',
        top: '15px',
        right: '15px',
        padding: '8px 12px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#dc3545',
        color: 'white',
        cursor: 'pointer',
        fontSize: '14px',
    },
    exchangeRateInfo: { backgroundColor: '#e0f7fa', padding: '10px', borderRadius: '5px', marginBottom: '25px', color: '#00796b', fontWeight: 'bold' },
    inputGroup: { marginBottom: '15px', textAlign: 'left' },
    label: { display: 'block', marginBottom: '5px', color: '#555', fontWeight: 'bold' },
    input: { width: 'calc(100% - 22px)', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px' },
    error: { color: 'red', fontWeight: 'bold' }
};

export default ExchangeConverter;