import React, { useState, useEffect } from 'react';

function Preguntas() {
  const [preguntas, setPreguntas] = useState([]);
  const [categoria, setCategoria] = useState('moda'); // Categoría por defecto

  // Función para obtener preguntas desde el backend
  useEffect(() => {
    const fetchPreguntas = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/preguntas?categoria=${categoria}`);
        const data = await response.json();
        setPreguntas(data);
      } catch (error) {
        console.error('Error al cargar las preguntas:', error);
      }
    };

    fetchPreguntas();
  }, [categoria]); // Se vuelve a ejecutar cada vez que cambie la categoría

  return (
    <div>
      <h1>Preguntas de {categoria}</h1>
      
      {/* Selector de categoría */}
      <select onChange={(e) => setCategoria(e.target.value)} value={categoria}>
        <option value="moda">Moda</option>
        <option value="historia">Historia</option>
        <option value="ciencia">Ciencia</option>
        <option value="deporte">Deporte</option>
        <option value="arte">Arte</option>
      </select>
      
      {/* Mostrar preguntas */}
      {preguntas.length > 0 ? (
        preguntas.map((pregunta, index) => (
          <div key={index}>
            <p>{pregunta.pregunta}</p>
            <ul>
              <li>{pregunta.opciones.a}</li>
              <li>{pregunta.opciones.b}</li>
              <li>{pregunta.opciones.c}</li>
              <li>{pregunta.opciones.d}</li>
            </ul>
          </div>
        ))
      ) : (
        <p>Cargando preguntas...</p>
      )}
    </div>
  );
}

export default Preguntas;
