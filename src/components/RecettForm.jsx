
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const RecipeForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [instructions, setInstructions] = useState('');
    const [image, setImage] = useState(null);
    const [imageName, setImageName] = useState('');
    const [errors, setErrors] = useState({});
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [ingredientsList, setIngredients] = useState([]);
    const dropdownRef = useRef(null);

    useEffect(() => {
        axios.get('http://localhost:8000/ingredients')
            .then((res) => {
                const ingredients = res.data.length > 0 ? Object.values(res.data[0]) : [];
                // console.log('Fetched ingredients:', ingredients);
                setIngredients(ingredients);
            })
            .catch((err) => {
                console.error('Error fetching ingredients:', err);
            });
    }, []);


    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const filteredIngredients = ingredientsList.filter(ingredient =>
        ingredient.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const validateForm = () => {
        const newErrors = {};

        if (!title.trim()) newErrors.title = 'Le titre est obligatoire';
        else if (title.length < 3) newErrors.title = 'Le titre doit avoir au moins 3 caractères';

        if (!description.trim()) newErrors.description = 'La description est obligatoire';

        if (selectedIngredients.length === 0) newErrors.ingredients = 'Veuillez sélectionner au moins un ingrédient';

        if (!instructions.trim()) newErrors.instructions = 'Les instructions sont obligatoires';

        if (!image) newErrors.image = 'L\'image est obligatoire';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    
    const handleSubmit = () => {
        if (validateForm()) {
            const newRecette = {
                title,
                description,
                ingredients: selectedIngredients,
                instructions,
                image: image ? URL.createObjectURL(image) : null 
            };

            axios.post('http://localhost:8000/recettes', newRecette)
                .then((res) => {
                    console.log('Recette ajoutée avec succès:', res.data);
                    alert('Recette ajoutée avec succès !');

                    setTitle('');
                    setDescription('');
                    setSelectedIngredients([]);
                    setInstructions('');
                    setImage(null);
                    setImageName('');
                    setErrors({});
                })
                .catch((err) => {
                    console.error("Erreur lors de l'ajout de la recette:", err);
                });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImageName(file.name);
        }
    };

    const toggleIngredient = (ingredient) => {
        if (selectedIngredients.includes(ingredient)) {
            setSelectedIngredients(selectedIngredients.filter(item => item !== ingredient));
        } else {
            setSelectedIngredients([...selectedIngredients, ingredient]);
        }
    };

    const removeIngredient = (ingredient) => {
        setSelectedIngredients(selectedIngredients.filter(item => item !== ingredient));

    };
    
   

    return (
        <div className="w-full min-h-screen p-6 bg-white rounded-lg shadow-lg">
            <div className="bg-yellow-300 py-4 px-6 rounded-t-lg -mx-6 -mt-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 text-center">Ajouter une Recette</h2>
            </div>

            <div className="space-y-6">
                <div className="space-y-1">
                    <label htmlFor="title" className="block text-gray-800 font-medium">Titre de la recette</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={`w-full p-3 border rounded-md bg-gray-50 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                </div>

                <div className="space-y-1">
                    <label htmlFor="description" className="block text-gray-800 font-medium">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="3"
                        className={`w-full p-3 border rounded-md bg-gray-50 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                </div>

                <div className="space-y-1">
                    <label htmlFor="ingredients" className="block text-gray-800 font-medium">Ingrédients</label>
                    <div className="relative" ref={dropdownRef}>
                        <div
                            className={`flex flex-wrap gap-2 min-h-12 p-2 border rounded-md bg-gray-50 cursor-text ${errors.ingredients ? 'border-red-500' : 'border-gray-300'}`}
                            onClick={() => setDropdownOpen(true)}
                        >
                            {selectedIngredients.map((ingredient) => (
                                <div key={ingredient} className="bg-yellow-300 px-2 py-1 rounded-md flex items-center gap-1 text-sm">
                                    <span>{ingredient}</span>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removeIngredient(ingredient); }}
                                        className="text-gray-600 hover:text-gray-800 font-bold"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() => setDropdownOpen(true)}
                                placeholder={selectedIngredients.length === 0 ? "Sélectionnez des ingrédients..." : ""}
                                className="flex-grow min-w-24 p-1 bg-transparent border-none focus:outline-none text-sm"
                            />
                        </div>

                        {dropdownOpen && (
                            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 overflow-y-auto rounded-md border border-gray-200">
                                {filteredIngredients.length > 0 ? (
                                    filteredIngredients.map((ingredient) => (
                                        <div
                                            key={ingredient}
                                            onClick={() => toggleIngredient(ingredient)}
                                            className={`p-2 hover:bg-gray-100 cursor-pointer ${selectedIngredients.includes(ingredient) ? 'bg-yellow-100' : ''}`}
                                        >
                                            <div className="flex items-center">
                                                <div className={`w-4 h-4 mr-2 border rounded ${selectedIngredients.includes(ingredient) ? 'bg-yellow-300 border-yellow-400' : 'border-gray-400'}`}>
                                                    {selectedIngredients.includes(ingredient) && <div className="flex items-center justify-center">✓</div>}
                                                </div>
                                                {ingredient}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-2 text-gray-500">Aucun ingrédient trouvé</div>
                                )}
                            </div>
                        )}
                    </div>
                    {errors.ingredients && <p className="text-red-500 text-sm">{errors.ingredients}</p>}
                </div>

                <div className="space-y-1">
                    <label htmlFor="instructions" className="block text-gray-800 font-medium">Instructions</label>
                    <textarea
                        id="instructions"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        rows="5"
                        className={`w-full p-3 border rounded-md bg-gray-50 ${errors.instructions ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.instructions && <p className="text-red-500 text-sm">{errors.instructions}</p>}
                </div>

                <div className="space-y-1">
                    <label htmlFor="image" className="block text-gray-800 font-medium">Image de la recette</label>
                    <div className={`p-3 border rounded-md bg-gray-50 ${errors.image ? 'border-red-500' : 'border-gray-300'}`}>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="text-gray-700 text-sm w-full"
                        />
                        {imageName && (
                            <div className="mt-2 text-sm text-gray-600">Fichier sélectionné: {imageName}</div>
                        )}
                    </div>
                    {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
                </div>

                <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full bg-yellow-400 p-3 rounded-md text-gray-800 font-bold hover:bg-yellow-500 transition-colors shadow-md"
                >
                    Ajouter la recette
                </button>
            </div>
        </div>
    );
};

export default RecipeForm;
