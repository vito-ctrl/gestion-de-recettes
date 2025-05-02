


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RecetteCard = () => {
    const navigate = useNavigate();
    const [recettes, setRecettes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRecettes = async () => {
            try {
                const response = await axios.get('http://localhost:8000/recettes');
                setRecettes(response.data);
            } catch (err) {
                setError("Erreur lors du chargement des recettes.");
            } finally {
                setLoading(false);
            }
        };
        fetchRecettes();
    }, []);

    const handleDetails = (id) => {
        navigate(`/recette/${id}`);
    };

    if (loading) return <p className="text-center mt-10">Chargement...</p>;
    if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

    return (
        <div className="p-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recettes.map((recette) => (
                <div
                    key={recette.id}
                    className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition-all duration-300 w-full max-w-sm cursor-pointer"
                    onClick={() => handleDetails(recette.id)}
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
                        onClick={(e) => {
                            e.stopPropagation(); 
                            handleDetails(recette.id);
                        }}
                        className="mt-auto bg-amber-400 hover:bg-orange-600 text-white py-2 px-4 rounded-lg"
                    >
                        Détails
                    </button>
                </div>
            ))}
        </div>
    );
};

export default RecetteCard;