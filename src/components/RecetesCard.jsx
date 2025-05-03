import React from 'react';
import { Link } from 'react-router-dom';

const RecetteCard = ({ id, title, image }) => {
  return (
    <div className="bg-gray-700 rounded-lg overflow-hidden shadow-lg transform transition-all hover:scale-105">
      <div className="relative h-48">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x200?text=Image+Non+Disponible';
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white truncate">{title}</h3>
        <div className="mt-4 flex justify-center">
          <Link
            to={`/Details/${id}`}
            className="inline-block px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors"
          >
            Voir la recette
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecetteCard;