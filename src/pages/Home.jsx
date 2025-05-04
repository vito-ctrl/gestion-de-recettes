import React, { useState, useEffect, useRef } from 'react';
import RecetteCard from '../components/RecetesCard';
import food from '../assets/background-recipeskingdom.png';
import NavBar from '../components/NavBar';
import { useFormik } from 'formik';
// import { Link } from 'react-router-dom';

const Home = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [cuisine, setCuisine] = useState('');
    const [showModal, setShowModal] = useState(false);
    const recetteCardRef = useRef(null);
    const [showModals, setShowModals] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    const API_KEY = '4175b93fb7fa4675bea3695b8c6214f1';
    const API_URL = 'https://api.spoonacular.com/recipes/complexSearch';

    useEffect(() => {
        fetchRecipes();
    }, []);

    const fetchRecipes = async (query = '', cuisineType = '') => {
        setLoading(true);
        try {
            let url = `${API_URL}?apiKey=${API_KEY}&number=12`;
            
            if (query) {
                url += `&query=${query}`;
            }
            
            if (cuisineType) {
                url += `&cuisine=${cuisineType}`;
            }

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

    const handleSearch = (e) => {
        e.preventDefault();
        fetchRecipes(searchQuery, cuisine);
    };

    const scrollToRecetteCard = () => {
        if (recetteCardRef.current) {
            recetteCardRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const cuisineOptions = [
        'African', 'American', 'British', 'Cajun', 'Caribbean', 
        'Chinese', 'Eastern European', 'European', 'French', 'German', 
        'Greek', 'Indian', 'Irish', 'Italian', 'Japanese', 'Jewish', 
        'Korean', 'Latin American', 'Mediterranean', 'Mexican', 'Middle Eastern', 
        'Nordic', 'Southern', 'Spanish', 'Thai', 'Vietnamese'
    ];

    const formik = useFormik({
        initialValues: {
          name: "",
          description: "",
          imageBase64: "",
        },
        validate: (values) => {
          const errors = {};
          if (!values.name) errors.name = "Le nom est requis";
          if (!values.description) errors.description = "La description est requise";
          if (!values.imageBase64) errors.imageBase64 = "L'image est requise";
          return errors;
        },
        onSubmit: (values) => {
          console.log("Form submitted", values);
          setShowModal(false);
        },
      });
    
      const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
    
        formik.setFieldValue("image", file);
    
        const reader = new FileReader();
        reader.onloadend = () => {
          formik.setFieldValue("imageBase64", reader.result);
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      };

    return (
        <>
        <NavBar/>
        <div className="min-h-screen bg-black">
            <section
                className="relative bg-cover bg-center h-screen flex items-center justify-center"
                style={{
                    backgroundImage: `url(${food})`,
                }}
            >
                <div className="absolute inset-0 bg-black opacity-60"></div>
                <div className="relative z-10 px-4 md:px-8 text-center max-w-4xl">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                        Inspirez-vous, cuisinez avec passion et savourez des moments inoubliables à table.
                    </h2>
                    <button
                        onClick={() => setShowModals(true)}
                        className="bg-gray-400 hover:bg-gray-100 text-gray-800 font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105"
                        >
                        add recettes
                    </button>

                    {showModals && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-white">
            <h2 className="text-2xl font-bold mb-4">Ajouter une recette</h2>

            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Nom de la recette"
                value={formik.values.name}
                onChange={formik.handleChange}
                className="w-full placeholder-gray-300 bg-gray-600 px-4 py-2 border rounded"
              />
              {formik.errors.name && (
                <p className="text-red-400 text-sm">{formik.errors.name}</p>
              )}

              <textarea
                name="description"
                placeholder="Description"
                value={formik.values.description}
                onChange={formik.handleChange}
                className="w-full placeholder-gray-300 bg-gray-600 px-4 py-2 border rounded"
              />
              {formik.errors.description && (
                <p className="text-red-400 text-sm">{formik.errors.description}</p>
              )}

              {/* Image Upload */}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-sm text-white"
                />
                {formik.errors.imageBase64 && (
                  <p className="text-red-400 text-sm">{formik.errors.imageBase64}</p>
                )}
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm text-gray-300 mb-2">Aperçu de l'image :</p>
                  <img
                    src={imagePreview}
                    alt="Aperçu"
                    className="max-w-full h-auto max-h-64 rounded-md border border-gray-400"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModals(false)}
                  className="px-4 py-2 rounded bg-red-500 hover:bg-red-600"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
                    <div className="mt-6">
                        
                        <button
                            onClick={scrollToRecetteCard}
                            className="bg-gray-400 hover:bg-gray-100 text-gray-800 font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105"
                        >
                            Découvrir nos recettes
                        </button>
                    </div>
                </div>
            </section>

            <div className="py-16 px-4 md:px-8">
                <div className="text-center mb-12">
                    <h1 ref={recetteCardRef} className="text-3xl md:text-4xl font-bold text-gray-200 relative inline-block">
                        Nos Recettes
                        <span className="block h-1 w-24 bg-gray-400 mx-auto mt-3"></span>
                    </h1>
                    <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
                        Explorez notre collection de délicieuses recettes créées avec passion pour vous inspirer en cuisine.
                    </p>
                </div>

                {/* Search and filter section */}
                <div className="mb-10 max-w-3xl mx-auto">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-grow">
                            <input
                                type="text"
                                placeholder="Rechercher des recettes..."
                                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="md:w-1/3">
                            <select
                                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                value={cuisine}
                                onChange={(e) => setCuisine(e.target.value)}
                            >
                                <option value="">Toutes les cuisines</option>
                                {cuisineOptions.map((option) => (
                                    <option key={option} value={option.toLowerCase()}>{option}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                        >
                            Rechercher
                        </button>
                    </form>
                </div>

                {/* Recipes grid */}
                <div>
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-400"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-500 py-10">
                            <p>Erreur: {error}</p>
                            <button 
                                onClick={() => fetchRecipes()} 
                                className="mt-4 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg"
                            >
                                Réessayer
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {recipes.length > 0 ? (
                                recipes.map((recipe) => (
                                    <RecetteCard
                                        key={recipe.id}
                                        id={recipe.id}
                                        title={recipe.title}
                                        image={recipe.image}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full text-center text-gray-400 py-10">
                                    <p>Aucune recette trouvée. Essayez une autre recherche.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
        </>
    );
};

export default Home;