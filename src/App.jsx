import React, { useState } from 'react';
import './App.css';

function App() {
  const [category, setCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);
  const categories = ['Moda', 'Historia', 'Ciencia', 'Deporte', 'Arte'];

  const handleCategorySelect = async (selectedCategory) => {
    setCategory(selectedCategory);
    const fetchedQuestions = await fetchQuestions(selectedCategory);
    setQuestions(fetchedQuestions);
    setScore(null); // Reset the score when changing category
    setUserAnswers({}); // Reset the user answers when changing category
  };

  const fetchQuestions = async (category) => {
    try {
      const response = await fetch(`https://backend-preguntas.vercel.app/api/questions?category=${category}`);
      const data = await response.json();
      return data.questions;
    } catch (error) {
      console.error('Error al obtener preguntas:', error);
      return [];
    }
  };

  const handleCalculateScore = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (userAnswers[i] === q.respuesta_correcta) {
        correct++;
      }
    });
    const percentage = (correct / questions.length) * 100;
    setScore(percentage);

    // Guardar los resultados en la base de datos después de calcular el puntaje
    saveResult(percentage);
  };

  const handleAnswerChange = (index, value) => {
    setUserAnswers({ ...userAnswers, [index]: value });
  };

  // Función para enviar los resultados al backend
  const saveResult = async (percentage) => {
    const resultData = {
      categoria: category,
      preguntas: questions,
      puntaje: percentage,
    };

    try {
      const response = await fetch('https://backend-preguntas.vercel.app/api/save-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resultData),
      });

      if (response.ok) {
        console.log('Resultado guardado exitosamente');
      } else {
        console.error('Error al guardar el resultado');
      }
    } catch (error) {
      console.error('Error al enviar el resultado al servidor:', error);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Quiz por Categoría</h1>

      <div className="category-container">
        {categories.map((cat) => (
          <button key={cat} className="category-button" onClick={() => handleCategorySelect(cat)}>
            {cat}
          </button>
        ))}
      </div>

      {questions.length > 0 && (
        <div className="questions-container">
          <h2>{category}</h2>
          {questions.map((question, index) => (
            <div key={index} className="question-card">
              <p className="question-text">{index + 1}. {question.pregunta}</p>
              <ul className="options-list">
                {Object.entries(question.opciones).map(([key, value]) => (
                  <li key={key}>
                    <label>
                      <input
                        type="radio"
                        name={`q${index}`}
                        value={key}
                        onChange={() => handleAnswerChange(index, key)}
                      />
                      {key}) {value}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <button className="calculate-button" onClick={handleCalculateScore}>
            Calcular Puntaje
          </button>

          {score !== null && (
            <div className="score">
              <h3>Tu puntaje: {score}%</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
