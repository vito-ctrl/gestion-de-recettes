import React from 'react';
import { useNavigate } from 'react-router-dom';

const recettes = [
    {
        id: 1,
        title: 'Pâtes Carbonara',
        description: 'Une recette simple et rapide de pâtes à la carbonara.',
        image: 'https://source.unsplash.com/400x300/?pasta',
        ingredients: ['Pâtes', 'Œufs', 'Lardons', 'Parmesan', 'Crème'],
    },
];

const RecetteCard = () => {
    const navigate = useNavigate();

    const handleDetails = (id) => {
        navigate(`/recette/${id}`);
    };

    return (
        <div className="p-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recettes.map((recette) => (
                <div
                    key={recette.id}
                    className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition-all duration-300 w-full max-w-sm"
                >
                    {recette.image && (
                        <img
                            src={recette.image}
                            alt={recette.title}
                            className="w-full h-48 object-cover rounded-xl mb-4"
                        />
                    )}
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{recette.title}</h2>
                    <p className="text-gray-600 mb-4">{recette.description}</p>

                    <button
                        onClick={() => handleDetails(recette.id)}
                        className="mt-auto bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg"
                    >
                        Détails
                    </button>
                </div>
            ))}
        </div>
    );
};

export default RecetteCard;
