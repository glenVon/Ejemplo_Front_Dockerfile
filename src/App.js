// import React, { useState, useEffect } from 'react';
// import './App.css';

// function App() {
//   const [dateTime, setDateTime] = useState(new Date());

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setDateTime(new Date());
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   const formatDate = (date) => {
//     const options = { 
//       weekday: 'long', 
//       year: 'numeric', 
//       month: 'long', 
//       day: 'numeric' 
//     };
//     return date.toLocaleDateString('es-ES', options);
//   };

//   const formatTime = (date) => {
//     return date.toLocaleTimeString('es-ES', {
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit'
//     });
//   };

//   return (
//     <div className="App">
//       <div className="container">
//         <h1>Fecha y Hora Actual</h1>
//         <div className="date">{formatDate(dateTime)}</div>
//         <div className="time">{formatTime(dateTime)}</div>
//       </div>
//     </div>
//   );
// }

// export default App;


import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Creamos los estados para guardar los datos, el estado de carga y posibles errores
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // El navegador buscará los datos en el localhost, y tu túnel SSH los llevará a AWS
    // ⚠️ REVISA LA URL: Asegúrate de que '/api/v0/productos' sea la ruta correcta de tu backend
    fetch('http://localhost:8080/api/v0/productos') 
      .then(response => {
        if (!response.ok) {
          throw new Error('No se pudo conectar con el Backend.');
        }
        return response.json();
      })
      .then(data => {
        setProductos(data); // Guardamos los datos que llegaron de MySQL
        setLoading(false);  // Quitamos el mensaje de carga
      })
      .catch(err => {
        console.error("Error capturado:", err);
        setError("No se pudieron cargar los datos. Verifica que el túnel SSH esté abierto.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="App">
      <div className="container">
        <h1>Lista de Productos</h1>
        
        {/* Mensaje de carga mientras llegan los datos por el túnel */}
        {loading && <p>Consultando a la base de datos en AWS...</p>}
        
        {/* Si el túnel está cerrado o hay un error, lo mostramos aquí */}
        {error && <p style={{ color: '#ff4c4c', fontWeight: 'bold' }}>{error}</p>}
        
        {/* Si hay datos y no hay error, dibujamos la tabla */}
        {!loading && !error && productos.length > 0 && (
          <table className="productos-table" style={{ margin: '0 auto', width: '80%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2', color: '#333' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Nombre</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Precio</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(producto => (
                <tr key={producto.id}>
                  {/* Asegúrate de que estas propiedades (id, nombre, precio) coincidan con el JSON de tu Spring Boot */}
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{producto.id}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{producto.nombre}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>${producto.precio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && !error && productos.length === 0 && (
          <p>La conexión fue exitosa, pero no hay productos registrados en la base de datos.</p>
        )}
      </div>
    </div>
  );
}

export default App;