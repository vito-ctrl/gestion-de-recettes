import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import NavBar from '../components/NavBar';

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_KEY = '4175b93fb7fa4675bea3695b8c6214f1';

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      setLoading(true);
      try {
        // Fetch basic recipe information
        const detailsResponse = await fetch(
          `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`
        );

        if (!detailsResponse.ok) {
          throw new Error(`API Error: ${detailsResponse.status}`);
        }

        const detailsData = await detailsResponse.json();
        
        // Fetch nutritional information
        const nutritionResponse = await fetch(
          `https://api.spoonacular.com/recipes/${id}/nutritionWidget.json?apiKey=${API_KEY}`
        );
        
        const nutritionData = nutritionResponse.ok ? await nutritionResponse.json() : null;
        
        // Combine all data
        setRecipe({
          ...detailsData,
          nutrition: nutritionData
        });
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (id) {
      fetchRecipeDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen bg-black flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-400"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen bg-black px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Erreur lors du chargement de la recette</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <Link to="/" className="inline-block px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors">
              Retourner à l'accueil
            </Link>
          </div>
        </div>
      </>
    );
  }

  if (!recipe) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen bg-black px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-200 mb-4">Recette non trouvée</h2>
            <Link to="/" className="inline-block px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors">
              Retourner à l'accueil
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-black text-gray-200">
        {/* Hero section with image and title */}
        <div className="relative h-96">
          <div className="absolute inset-0">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/1200x400?text=Image+Non+Disponible';
              }}
            />
            <div className="absolute inset-0 bg-black opacity-50"></div>
          </div>
          <div className="relative h-full flex items-end">
            <div className="container mx-auto px-4 pb-8">
              <h1 className="text-4xl font-bold text-white">{recipe.title}</h1>
              <div className="flex flex-wrap gap-2 mt-3">
                {recipe.diets && recipe.diets.map((diet, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                    {diet}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recipe content */}
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left column: Info, ingredients, instructions */}
            <div className="lg:w-2/3">
              {/* Quick info */}
              <div className="flex flex-wrap gap-6 mb-8 p-4 bg-gray-800 rounded-lg">
                <div>
                  <span className="block text-sm text-gray-400">Temps de préparation</span>
                  <span className="font-medium">{recipe.readyInMinutes} minutes</span>
                </div>
                <div>
                  <span className="block text-sm text-gray-400">Portions</span>
                  <span className="font-medium">{recipe.servings}</span>
                </div>
                <div>
                  <span className="block text-sm text-gray-400">Score de santé</span>
                  <span className="font-medium">{recipe.healthScore}/100</span>
                </div>
                <div>
                  <span className="block text-sm text-gray-400">Prix par portion</span>
                  <span className="font-medium">{recipe.pricePerServing ? `$${(recipe.pricePerServing / 100).toFixed(2)}` : 'Non disponible'}</span>
                </div>
              </div>

              {/* Summary */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-4">À propos</h2>
                <div 
                  className="text-gray-300 recipe-summary"
                  dangerouslySetInnerHTML={{ __html: recipe.summary }}
                />
              </div>

              {/* Ingredients */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-4">Ingrédients</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {recipe.extendedIngredients && recipe.extendedIngredients.map((ingredient) => (
                    <li key={ingredient.id} className="flex items-start">
                      <span className="inline-block w-2 h-2 mt-2 mr-2 bg-gray-400 rounded-full"></span>
                      <span>
                        {ingredient.amount} {ingredient.unit} {ingredient.nameClean || ingredient.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-4">Instructions</h2>
                {recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0 ? (
                  <ol className="space-y-6">
                    {recipe.analyzedInstructions[0].steps.map((step) => (
                      <li key={step.number} className="flex">
                        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full mr-4">
                          {step.number}
                        </span>
                        <div className="pt-1">{step.step}</div>
                      </li>
                    ))}
                  </ol>
                ) : recipe.instructions ? (
                  <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
                ) : (
                  <p>Aucune instruction disponible pour cette recette.</p>
                )}
              </div>
            </div>

            {/* Right column: Nutrition, equipment, etc */}
            <div className="lg:w-1/3">
              {/* Nutrition */}
              {recipe.nutrition && (
                <div className="mb-8 p-6 bg-gray-800 rounded-lg">
                  <h2 className="text-xl font-bold mb-4">Nutrition (par portion)</h2>
                  <ul className="space-y-3">
                    {recipe.nutrition.nutrients && recipe.nutrition.nutrients.slice(0, 8).map(nutrient => (
                      <li key={nutrient.name} className="flex justify-between">
                        <span>{nutrient.name}</span>
                        <span className="font-medium">{nutrient.amount} {nutrient.unit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Wine pairing */}
              {recipe.winePairing && recipe.winePairing.pairedWines && recipe.winePairing.pairedWines.length > 0 && (
                <div className="mb-8 p-6 bg-gray-800 rounded-lg">
                  <h2 className="text-xl font-bold mb-4">Accords de vin</h2>
                  <p className="mb-3 text-gray-300">{recipe.winePairing.pairingText}</p>
                  <h3 className="font-medium text-gray-300 mb-2">Suggestions:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {recipe.winePairing.pairedWines.map((wine, index) => (
                      <li key={index} className="text-gray-300">{wine}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Source */}
              {recipe.sourceUrl && (
                <div className="mb-8 p-6 bg-gray-800 rounded-lg">
                  <h2 className="text-xl font-bold mb-4">Source</h2>
                  <p>
                    <a 
                      href={recipe.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      {recipe.sourceName || 'Voir la recette originale'}
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Back button */}
          <div className="mt-10">
            <Link to="/" className="inline-block px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
              ← Retourner aux recettes
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecipeDetails;