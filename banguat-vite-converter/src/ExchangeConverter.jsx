import React, { useState, useEffect } from 'react';

// --- MODIFICACIÓN CLAVE AQUÍ ---
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://converterbackend-vv81.onrender.com' // URL para producción
  : 'http://localhost:3000';                   // URL para desarrollo local
// ------------------------------------

function ExchangeConverter() {
    const [exchangeRateData, setExchangeRateData] = useState(null); // Objeto: { fecha, valor }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [quetzales, setQuetzales] = useState('');
    const [dollars, setDollars] = useState('');

    // 1. Obtener el tipo de cambio del día al cargar el componente
    useEffect(() => {
        const fetchExchangeRate = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/tipo-cambio/dia`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const responseData = await response.json();

                // Esperamos { success: true, message: ..., data: { fecha, valor } }
                if (responseData.success && responseData.data && typeof responseData.data.valor === 'number') {
                    setExchangeRateData(responseData.data); // Guarda el objeto completo { fecha, valor }
                } else {
                    throw new Error('Formato de datos de tipo de cambio inesperado.');
                }

            } catch (e) {
                console.error("Error fetching exchange rate:", e);
                setError("No se pudo obtener el tipo de cambio del día.");
            } finally {
                setLoading(false);
            }
        };

        fetchExchangeRate();
    }, []); // El array vacío asegura que se ejecute solo una vez al montar

    // Helper para obtener el tipo de cambio de "venta" o "referencia"
    const getRate = () => exchangeRateData ? exchangeRateData.valor : null;


    // 2. Manejar la conversión de Quetzales a Dólares
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
        setDollars(convertedDollars.toFixed(2)); // Redondea a 2 decimales
    };

    // 3. Manejar la conversión de Dólares a Quetzales
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
        setQuetzales(convertedQuetzales.toFixed(2)); // Redondea a 2 decimales
    };

    if (loading) return <div style={styles.container}>Cargando tipo de cambio...</div>;
    if (error) return <div style={styles.container}><p style={styles.error}>{error}</p></div>;
    if (!exchangeRateData) return <div style={styles.container}><p style={styles.error}>Tipo de cambio no disponible.</p></div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Conversor de Quetzales a Dólares</h1>
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

            <p style={styles.note}>
               
            </p>
        </div>
    );
}

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        maxWidth: '500px',
        margin: '50px auto',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        backgroundColor: '#f9f9f9',
        textAlign: 'center',
    },
    title: {
        color: '#333',
        fontSize: '24px',
        marginBottom: '20px',
    },
    exchangeRateInfo: {
        backgroundColor: '#e0f7fa',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '25px',
        color: '#00796b',
        fontWeight: 'bold',
    },
    inputGroup: {
        marginBottom: '15px',
        textAlign: 'left',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        color: '#555',
        fontWeight: 'bold',
    },
    input: {
        width: 'calc(100% - 22px)',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '16px',
    },
    note: {
        fontSize: '14px',
        color: '#777',
        marginTop: '20px',
    },
    error: {
        color: 'red',
        fontWeight: 'bold',
    }
};

export default ExchangeConverter;