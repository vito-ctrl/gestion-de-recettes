
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import defaultImage from '../assets/indian food.jpeg'; 
const RecetteDetail = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [recette, setRecette] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const API_KEY = '4175b93fb7fa4675bea3695b8c6214f1';
    const API_URL = 'https://api.spoonacular.com/recipes/complexSearch';

    useEffect(() => {
        const fetchRecetteDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/recettes/${id}`);
                setRecette(response.data);
            } catch (err) {
                setError("Erreur lors du chargement de la recette.");
            } finally {
                setLoading(false);
            }

            try {
                let url = `${API_URL}?apiKey=${API_KEY}&number=12`;
    
                const response = await fetch(url);
                
                if (!response.ok) {
                    throw new Error(`API Error: ${response.status}`);
                }
                
                const data = await response.json();
                setRecipes(data.results);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        if (id) {
            fetchRecetteDetails();
        }

        co
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <p className="text-xl">Chargement...</p>
        </div>
    );

    if (error || !recette) return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
            <p className="text-xl text-red-500 mb-4">{error || "Recette non trouvée"}</p>
            <button
                onClick={() => navigate('/')}
                className="bg-gray-400 hover:bg-gray-500 text-gray-800 font-bold py-3 px-6 rounded-full transition-all shadow-lg hover:scale-105"
            >
                ← Retour aux recettes
            </button>
        </div>
    );
    const parsedInstructions = Array.isArray(recette.instructions)
        ? recette.instructions
        : recette.instructions?.split('", "').map(instr => instr.replace(/(^"|"$)/g, '').trim());

    return (
        <section className="min-h-screen bg-black px-4 md:px-10 py-10">
            <div
                className="relative bg-cover bg-center h-96 rounded-xl shadow-lg mb-10"
                style={{ backgroundImage: `url(${recette.image || defaultImage})` }}
            >
                <div className="absolute inset-0 bg-black opacity-60 rounded-xl"></div>
                <div className="relative z-10 flex items-center justify-center h-full text-center px-6">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white">
                        {recette.title}
                    </h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
                {recette.description && (
                    <div className="bg-black p-6 rounded-lg shadow-md">
                        <p className="text-white text-lg">{recette.description}</p>
                    </div>
                )}

                <div>
                    <h2 className="text-2xl font-semibold text-gray-200 mb-4 relative inline-block">
                        Ingrédients
                        <span className="block h-1 w-16 bg-gray-400 mt-2"></span>
                    </h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 text-lg pl-4">
                        {recette.ingredients && recette.ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-gray-200 mb-4 relative inline-block">
                        Instructions
                        <span className="block h-1 w-16 bg-gray-400 mt-2"></span>
                    </h2>
                    <ol className="list-decimal list-inside space-y-3 text-gray-300 text-lg pl-4">
                        {parsedInstructions && parsedInstructions.map((instruction, index) => (
                            <li key={index} className="mb-2">{instruction}</li>
                        ))}
                    </ol>

                </div>

                <div className="pt-6">
                    <button
                        onClick={() => navigate('/')}
                        className="bg-gray-400 hover:bg-gray-500 text-gray-800 font-bold py-3 px-6 rounded-full transition-all shadow-lg hover:scale-105"
                    >
                        ← Retour aux recettes
                    </button>
                </div>
            </div>
        </section>
    );
};

export default RecetteDetail;