import React from "react";

const categorias = ["Moda", "Historia", "Ciencia", "Deporte", "Arte"];

const CategoriaSelector = ({ onSeleccionar }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Elige una categoría</h1>
      <div className="w-full max-w-sm space-y-4">
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => onSeleccionar(cat)}
            className="w-full py-4 bg-indigo-500 rounded-xl shadow-md hover:bg-indigo-600 transition"
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoriaSelector;
