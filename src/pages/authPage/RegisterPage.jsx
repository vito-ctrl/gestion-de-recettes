import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
// import { Toaster} from 'react-hot-toast';
import * as Yup from "yup";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // Define validation schema using Yup
  const validationSchema = Yup.object({
    username: Yup.string()
      .required("Le nom d'utilisateur est requis")
      .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
    email: Yup.string()
      .email("Adresse email invalide")
      .required("L'email est requis"),
    password: Yup.string()
      .required("Le mot de passe est requis")
      .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Les mots de passe ne correspondent pas")
      .required("La confirmation du mot de passe est requise")
  });

  // Initial form values
  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setServerError("");
    setLoading(true);

    try {
      // Check if user already exists
      const checkResponse = await fetch(`http://localhost:3001/users?email=${values.email}`);
      const existingUsers = await checkResponse.json();

      if (existingUsers.length > 0) {
        setServerError("Cet email est déjà utilisé.");
        setLoading(false);
        return;
      }

      // Create new user
      const response = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password, 
          createdAt: new Date().toISOString()
        }),
      });

      if (response.ok) {
        resetForm();
      toast.success("Inscription réussie !");
        navigate("/login");
      } else {
        setServerError("Erreur lors de l'inscription. Veuillez réessayer.");
      }
    } catch (err) {
      setServerError("Erreur serveur. Veuillez vérifier que json-server est en cours d'exécution.");
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-gray-900 border border-gray-600 rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-30 relative w-full max-w-md">
        <h2 className="text-3xl text-white font-bold text-center mb-6">📝 Inscription</h2>
      <Toaster/>

        {serverError && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-100 px-4 py-2 rounded mb-4">
            {serverError}
          </div>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div className="relative my-4">
                <Field
                  type="text"
                  name="username"
                  className="block w-full py-2 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-500 focus:outline-none focus:ring-0 focus:border-gray-500 peer"
                />
                <label htmlFor="username" className="absolute text-sm text-white transition-all duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Nom d'utilisateur
                </label>
                <ErrorMessage name="username" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <div className="relative my-4">
                <Field
                  type="email"
                  name="email"
                  className="block w-full py-2 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-500 focus:outline-none focus:ring-0 focus:border-gray-500 peer"
                />
                <label htmlFor="email" className="absolute text-sm text-white transition-all duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Votre Email
                </label>
                <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <div className="relative my-4">
                <Field
                  type="password"
                  name="password"
                  className="block w-full py-2 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-500 focus:outline-none focus:ring-0 focus:border-gray-500 peer"
                />
                <label htmlFor="password" className="absolute text-sm text-white transition-all duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Votre Mot de passe
                </label>
                <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <div className="relative my-4">
                <Field
                  type="password"
                  name="confirmPassword"
                  className="block w-full py-2 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-500 focus:outline-none focus:ring-0 focus:border-gray-500 peer"
                />
                <label htmlFor="confirmPassword" className="absolute text-sm text-white transition-all duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Confirmer Mot de passe
                </label>
                <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full mt-6 mb-4 rounded-full bg-gray-600 text-white hover:bg-gray-700 py-2 transition-colors duration-300 disabled:bg-gray-800 disabled:cursor-not-allowed"
              >
                {loading ? "Inscription en cours..." : "S'inscrire"}
              </button>

              <div className="text-center text-white text-sm">
                <span>Déjà un compte ? </span>
                <Link className="text-gray-500" to="/login">Se connecter</Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RegisterPage;