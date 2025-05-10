import React, { useState } from 'react';
import {
  Brain, Shirt, BookOpen, FlaskConical, Dumbbell, Paintbrush,
  ChevronLeft, ChevronRight
} from 'lucide-react';

const icons = {
  Moda: <Shirt className="w-6 h-6 mr-2" />,
  Historia: <BookOpen className="w-6 h-6 mr-2" />,
  Ciencia: <FlaskConical className="w-6 h-6 mr-2" />,
  Deporte: <Dumbbell className="w-6 h-6 mr-2" />,
  Arte: <Paintbrush className="w-6 h-6 mr-2" />,
};

function App() {
  const [category, setCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [step, setStep] = useState(1); // 1: categoría, 2: preguntas, 3: resultado
  const categories = ['Moda', 'Historia', 'Ciencia', 'Deporte', 'Arte'];

  const handleCategorySelect = async (selectedCategory) => {
    setCategory(selectedCategory);
    const fetchedQuestions = await fetchQuestions(selectedCategory);
    setQuestions(fetchedQuestions);
    setScore(null);
    setUserAnswers({});
    setStep(2); // Ir a preguntas
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
      if (userAnswers[i] === q.respuesta_correcta) correct++;
    });
    const percentage = (correct / questions.length) * 100;
    setScore(percentage);
    saveResult(percentage);
    setStep(3); // Ir a resultados
  };

  const handleAnswerChange = (index, value) => {
    setUserAnswers({ ...userAnswers, [index]: value });
  };

  const saveResult = async (percentage) => {
    const resultData = { categoria: category, preguntas: questions, puntaje: percentage };
    try {
      const response = await fetch('https://backend-preguntas.vercel.app/api/save-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resultData),
      });
      if (!response.ok) throw new Error('Error al guardar el resultado');
    } catch (error) {
      console.error('Error al enviar el resultado al servidor:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 flex flex-col items-center">
      <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-6 flex items-center">
        <Brain className="w-8 h-8 mr-2 text-blue-700" /> Quiz por Categoría
      </h1>

      {/* Pantalla 1: Categorías */}
      {step === 1 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className="flex items-center justify-center bg-white shadow-md hover:bg-blue-100 px-4 py-2 rounded-xl text-blue-700 font-medium transition-all duration-300"
            >
              {icons[cat]} {cat}
            </button>
          ))}
        </div>
      )}

      {/* Pantalla 2: Preguntas */}
      {step === 2 && (
        <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <button
              className="flex items-center text-blue-600 hover:underline"
              onClick={() => setStep(1)}
            >
              <ChevronLeft className="w-5 h-5 mr-1" /> Volver
            </button>
            <h2 className="text-xl font-semibold text-blue-800">{category}</h2>
          </div>

          {questions.map((question, index) => (
            <div key={index} className="mb-6 border-b pb-4">
              <p className="text-lg font-medium mb-2">
                {index + 1}. {question.pregunta}
              </p>
              <ul>
                {Object.entries(question.opciones).map(([key, value]) => (
                  <li key={key} className="mb-1">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`q${index}`}
                        value={key}
                        checked={userAnswers[index] === key}
                        onChange={() => handleAnswerChange(index, key)}
                        className="accent-blue-600"
                      />
                      <span>{key}) {value}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <button
            onClick={handleCalculateScore}
            className="w-full bg-blue-700 text-white py-2 rounded-xl hover:bg-blue-800 transition-colors duration-300 mt-4"
          >
            Calcular Puntaje
          </button>
        </div>
      )}

      {/* Pantalla 3: Resultados */}
      {step === 3 && (
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Resultados</h2>
          <p className="text-lg text-green-600 mb-4">Tu puntaje: <strong>{score}%</strong></p>
          <button
            onClick={() => setStep(1)}
            className="flex items-center justify-center mx-auto bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all"
          >
            <ChevronLeft className="w-5 h-5 mr-2" /> Volver a Categorías
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
