

// import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';

// const RecipeForm = () => {
//     const [ingredientsList, setIngredients] = useState([]);
//     const [dropdownOpen, setDropdownOpen] = useState(false);
//     const [searchTerm, setSearchTerm] = useState('');
//     const dropdownRef = useRef(null);

//     useEffect(() => {
//         axios.get('http://localhost:8000/ingredients')
//             .then((res) => {
//                 const ingredients = res.data.length > 0 ? Object.values(res.data[0]) : [];
//                 setIngredients(ingredients);
//             })
//             .catch((err) => {
//                 console.error('Error fetching ingredients:', err);
//             });
//     }, []);

//     useEffect(() => {
//         function handleClickOutside(event) {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//                 setDropdownOpen(false);
//             }
//         }

//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, [dropdownRef]);

//     const filteredIngredients = ingredientsList.filter(ingredient =>
//         ingredient.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const formik = useFormik({
//         initialValues: {
//             title: '',
//             description: '',
//             ingredients: [],
//             instructions: '',
//             image: null
//         },
//         validationSchema: Yup.object({
//             title: Yup.string()
//                 .min(3, 'Le titre doit avoir au moins 3 caractères')
//                 .required('Le titre est obligatoire'),
//             description: Yup.string().required('La description est obligatoire'),
//             ingredients: Yup.array().min(1, 'Veuillez sélectionner au moins un ingrédient'),
//             instructions: Yup.string().required('Les instructions sont obligatoires'),
//             image: Yup.mixed().required('L\'image est obligatoire')
//         }),
//         onSubmit: (values) => {
//             const newRecette = {
//                 title: values.title,
//                 description: values.description,
//                 ingredients: values.ingredients,
//                 instructions: values.instructions,
//                 image: values.image ? URL.createObjectURL(values.image) : null
//             };

//             axios.post('http://localhost:8000/recettes', newRecette)
//                 .then((res) => {
//                     console.log('Recette ajoutée avec succès:', res.data);
//                     alert('Recette ajoutée avec succès !');
//                     formik.resetForm();
//                 })
//                 .catch((err) => {
//                     console.error("Erreur lors de l'ajout de la recette:", err);
//                 });
//         }
//     });

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             formik.setFieldValue('image', file);
//         }
//     };

//     const toggleIngredient = (ingredient) => {
//         const newIngredients = formik.values.ingredients.includes(ingredient)
//             ? formik.values.ingredients.filter(item => item !== ingredient)
//             : [...formik.values.ingredients, ingredient];
//         formik.setFieldValue('ingredients', newIngredients);
//     };

//     const removeIngredient = (ingredient) => {
//         const newIngredients = formik.values.ingredients.filter(item => item !== ingredient);
//         formik.setFieldValue('ingredients', newIngredients);
//     };

//     return (
//         <div className="w-full min-h-screen p-6 bg-white rounded-lg shadow-lg">
//             <div className="bg-yellow-300 py-4 px-6 rounded-t-lg -mx-6 -mt-6 mb-6">
//                 <h2 className="text-2xl font-bold text-gray-800 text-center">Ajouter une Recette</h2>
//             </div>

//             <div className="space-y-6">
//                 <div className="space-y-1">
//                     <label htmlFor="title" className="block text-gray-800 font-medium">Titre de la recette</label>
//                     <input
//                         type="text"
//                         id="title"
//                         value={formik.values.title}
//                         onChange={formik.handleChange}
//                         className={`w-full p-3 border rounded-md bg-gray-50 ${formik.errors.title && formik.touched.title ? 'border-red-500' : 'border-gray-300'}`}
//                     />
//                     {formik.errors.title && formik.touched.title && <p className="text-red-500 text-sm">{formik.errors.title}</p>}
//                 </div>

//                 <div className="space-y-1">
//                     <label htmlFor="description" className="block text-gray-800 font-medium">Description</label>
//                     <textarea
//                         id="description"
//                         value={formik.values.description}
//                         onChange={formik.handleChange}
//                         rows="3"
//                         className={`w-full p-3 border rounded-md bg-gray-50 ${formik.errors.description && formik.touched.description ? 'border-red-500' : 'border-gray-300'}`}
//                     />
//                     {formik.errors.description && formik.touched.description && <p className="text-red-500 text-sm">{formik.errors.description}</p>}
//                 </div>

//                 <div className="space-y-1">
//                     <label htmlFor="ingredients" className="block text-gray-800 font-medium">Ingrédients</label>
//                     <div className="relative" ref={dropdownRef}>
//                         <div
//                             className={`flex flex-wrap gap-2 min-h-12 p-2 border rounded-md bg-gray-50 cursor-text ${formik.errors.ingredients && formik.touched.ingredients ? 'border-red-500' : 'border-gray-300'}`}
//                             onClick={() => setDropdownOpen(true)}
//                         >
//                             {formik.values.ingredients.map((ingredient) => (
//                                 <div key={ingredient} className="bg-yellow-300 px-2 py-1 rounded-md flex items-center gap-1 text-sm">
//                                     <span>{ingredient}</span>
//                                     <button
//                                         type="button"
//                                         onClick={(e) => { e.stopPropagation(); removeIngredient(ingredient); }}
//                                         className="text-gray-600 hover:text-gray-800 font-bold"
//                                     >
//                                         ×
//                                     </button>
//                                 </div>
//                             ))}
//                             <input
//                                 type="text"
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 onFocus={() => setDropdownOpen(true)}
//                                 placeholder={formik.values.ingredients.length === 0 ? "Sélectionnez des ingrédients..." : ""}
//                                 className="flex-grow min-w-24 p-1 bg-transparent border-none focus:outline-none text-sm"
//                             />
//                         </div>

//                         {dropdownOpen && (
//                             <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 overflow-y-auto rounded-md border border-gray-200">
//                                 {filteredIngredients.length > 0 ? (
//                                     filteredIngredients.map((ingredient) => (
//                                         <div
//                                             key={ingredient}
//                                             onClick={() => toggleIngredient(ingredient)}
//                                             className={`p-2 hover:bg-gray-100 cursor-pointer ${formik.values.ingredients.includes(ingredient) ? 'bg-yellow-100' : ''}`}
//                                         >
//                                             <div className="flex items-center">
//                                                 <div className={`w-4 h-4 mr-2 border rounded ${formik.values.ingredients.includes(ingredient) ? 'bg-yellow-300 border-yellow-400' : 'border-gray-400'}`}>
//                                                     {formik.values.ingredients.includes(ingredient) && <div className="flex items-center justify-center">✓</div>}
//                                                 </div>
//                                                 {ingredient}
//                                             </div>
//                                         </div>
//                                     ))
//                                 ) : (
//                                     <div className="p-2 text-gray-500">Aucun ingrédient trouvé</div>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//                     {formik.errors.ingredients && formik.touched.ingredients && <p className="text-red-500 text-sm">{formik.errors.ingredients}</p>}
//                 </div>

//                 <div className="space-y-1">
//                     <label htmlFor="instructions" className="block text-gray-800 font-medium">Instructions</label>
//                     <textarea
//                         id="instructions"
//                         value={formik.values.instructions}
//                         onChange={formik.handleChange}
//                         rows="5"
//                         className={`w-full p-3 border rounded-md bg-gray-50 ${formik.errors.instructions && formik.touched.instructions ? 'border-red-500' : 'border-gray-300'}`}
//                     />
//                     {formik.errors.instructions && formik.touched.instructions && <p className="text-red-500 text-sm">{formik.errors.instructions}</p>}
//                 </div>

//                 <div className="space-y-1">
//                     <label htmlFor="image" className="block text-gray-800 font-medium">Image de la recette</label>
//                     <div className={`p-3 border rounded-md bg-gray-50 ${formik.errors.image && formik.touched.image ? 'border-red-500' : 'border-gray-300'}`}>
//                         <input
//                             type="file"
//                             id="image"
//                             accept="image/*"
//                             onChange={handleImageChange}
//                             className="text-gray-700 text-sm w-full"
//                         />
//                         {formik.values.image && (
//                             <div className="mt-2 text-sm text-gray-600">Fichier sélectionné: {formik.values.image.name}</div>
//                         )}
//                     </div>
//                     {formik.errors.image && formik.touched.image && <p className="text-red-500 text-sm">{formik.errors.image}</p>}
//                 </div>

//                 <button
//                     type="button"
//                     onClick={formik.handleSubmit}
//                     className="w-full bg-yellow-400 p-3 rounded-md text-gray-800 font-bold hover:bg-yellow-500 transition-colors shadow-md"
//                 >
//                     Ajouter la recette
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default RecipeForm;




import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const RecipeForm = () => {
    const [ingredientsList, setIngredients] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        axios.get('http://localhost:8000/ingredients')
            .then((res) => {
                const ingredients = res.data.length > 0 ? Object.values(res.data[0]) : [];
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

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            ingredients: [],
            instructions: '',
            image: null,
            imageBase64: '' // New field for base64 image
        },
        validationSchema: Yup.object({
            title: Yup.string()
                .min(3, 'Le titre doit avoir au moins 3 caractères')
                .required('Le titre est obligatoire'),
            description: Yup.string().required('La description est obligatoire'),
            ingredients: Yup.array().min(1, 'Veuillez sélectionner au moins un ingrédient'),
            instructions: Yup.string().required('Les instructions sont obligatoires'),
            imageBase64: Yup.string().required('L\'image est obligatoire')
        }),
        onSubmit: (values) => {
            const newRecette = {
                title: values.title,
                description: values.description,
                ingredients: values.ingredients,
                instructions: values.instructions,
                image: values.imageBase64 // Send the base64 string instead of URL object
            };

            axios.post('http://localhost:8000/recettes', newRecette)
                .then((res) => {
                    console.log('Recette ajoutée avec succès:', res.data);
                    alert('Recette ajoutée avec succès !');
                    formik.resetForm();
                    setImagePreview(null); // Clear the preview
                })
                .catch((err) => {
                    console.error("Erreur lors de l'ajout de la recette:", err);
                });
        }
    });

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                // Convert the file to base64
                const base64 = await convertToBase64(file);
                // Set the base64 string in formik
                formik.setFieldValue('imageBase64', base64);
                formik.setFieldValue('image', file);
                // Create a preview
                setImagePreview(base64);
            } catch (error) {
                console.error("Error converting image to base64:", error);
            }
        }
    };

    const toggleIngredient = (ingredient) => {
        const newIngredients = formik.values.ingredients.includes(ingredient)
            ? formik.values.ingredients.filter(item => item !== ingredient)
            : [...formik.values.ingredients, ingredient];
        formik.setFieldValue('ingredients', newIngredients);
    };

    const removeIngredient = (ingredient) => {
        const newIngredients = formik.values.ingredients.filter(item => item !== ingredient);
        formik.setFieldValue('ingredients', newIngredients);
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
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        className={`w-full p-3 border rounded-md bg-gray-50 ${formik.errors.title && formik.touched.title ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {formik.errors.title && formik.touched.title && <p className="text-red-500 text-sm">{formik.errors.title}</p>}
                </div>

                <div className="space-y-1">
                    <label htmlFor="description" className="block text-gray-800 font-medium">Description</label>
                    <textarea
                        id="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        rows="3"
                        className={`w-full p-3 border rounded-md bg-gray-50 ${formik.errors.description && formik.touched.description ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {formik.errors.description && formik.touched.description && <p className="text-red-500 text-sm">{formik.errors.description}</p>}
                </div>

                <div className="space-y-1">
                    <label htmlFor="ingredients" className="block text-gray-800 font-medium">Ingrédients</label>
                    <div className="relative" ref={dropdownRef}>
                        <div
                            className={`flex flex-wrap gap-2 min-h-12 p-2 border rounded-md bg-gray-50 cursor-text ${formik.errors.ingredients && formik.touched.ingredients ? 'border-red-500' : 'border-gray-300'}`}
                            onClick={() => setDropdownOpen(true)}
                        >
                            {formik.values.ingredients.map((ingredient) => (
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
                                placeholder={formik.values.ingredients.length === 0 ? "Sélectionnez des ingrédients..." : ""}
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
                                            className={`p-2 hover:bg-gray-100 cursor-pointer ${formik.values.ingredients.includes(ingredient) ? 'bg-yellow-100' : ''}`}
                                        >
                                            <div className="flex items-center">
                                                <div className={`w-4 h-4 mr-2 border rounded ${formik.values.ingredients.includes(ingredient) ? 'bg-yellow-300 border-yellow-400' : 'border-gray-400'}`}>
                                                    {formik.values.ingredients.includes(ingredient) && <div className="flex items-center justify-center">✓</div>}
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
                    {formik.errors.ingredients && formik.touched.ingredients && <p className="text-red-500 text-sm">{formik.errors.ingredients}</p>}
                </div>

                <div className="space-y-1">
                    <label htmlFor="instructions" className="block text-gray-800 font-medium">Instructions</label>
                    <textarea
                        id="instructions"
                        value={formik.values.instructions}
                        onChange={formik.handleChange}
                        rows="5"
                        className={`w-full p-3 border rounded-md bg-gray-50 ${formik.errors.instructions && formik.touched.instructions ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {formik.errors.instructions && formik.touched.instructions && <p className="text-red-500 text-sm">{formik.errors.instructions}</p>}
                </div>

                <div className="space-y-1">
                    <label htmlFor="image" className="block text-gray-800 font-medium">Image de la recette</label>
                    <div className={`p-3 border rounded-md bg-gray-50 ${formik.errors.imageBase64 && formik.touched.imageBase64 ? 'border-red-500' : 'border-gray-300'}`}>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="text-gray-700 text-sm w-full"
                        />
                        {formik.values.image && (
                            <div className="mt-2 text-sm text-gray-600">Fichier sélectionné: {formik.values.image.name}</div>
                        )}
                    </div>
                    {formik.errors.imageBase64 && formik.touched.imageBase64 && (
                        <p className="text-red-500 text-sm">{formik.errors.imageBase64}</p>
                    )}

                    {/* Image preview */}
                    {imagePreview && (
                        <div className="mt-4">
                            <p className="text-sm text-gray-700 mb-2">Aperçu de l'image:</p>
                            <img
                                src={imagePreview}
                                alt="Aperçu de la recette"
                                className="max-w-full h-auto max-h-64 rounded-md border border-gray-300"
                            />
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    onClick={formik.handleSubmit}
                    className="w-full bg-yellow-400 p-3 rounded-md text-gray-800 font-bold hover:bg-yellow-500 transition-colors shadow-md"
                >
                    Ajouter la recette
                </button>
            </div>
        </div>
    );
};

export default RecipeForm;