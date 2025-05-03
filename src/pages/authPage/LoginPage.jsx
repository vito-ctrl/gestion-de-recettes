import { useState } from "react";
import { BiUser } from "react-icons/bi";
import { AiOutlineLock } from "react-icons/ai";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { ToastContainer } from "react-toastify";
import { useAuth } from "./AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Adresse email invalide")
      .required("L'email est requis"),
    password: Yup.string().required("Le mot de passe est requis")
  });

  // Initial form values
  const initialValues = {
    email: "",
    password: "",
    rememberMe: false
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    setLoginError("");
    setLoading(true);

    try {
      // Use login function from auth context
      const success = await login(
        values.email, 
        values.password, 
        values.rememberMe
      );

      if (success) {
        // Redirect to home after a brief delay to show the success toast
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setLoginError("Email ou mot de passe incorrect");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-gray-900 border border-green-600 rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-30 relative">
        <h1 className="text-4xl text-white font-bold text-center mb-6">Login</h1>

        {loginError && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-100 px-4 py-2 rounded mb-4">
            {loginError}
          </div>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              {/* Email Field */}
              <div className="relative my-4">
                <Field
                  type="email"
                  name="email"
                  className={`block w-72 py-2 px-0 text-sm text-white bg-transparent border-0 border-b-2 ${
                    errors.email && touched.email
                      ? "border-red-500"
                      : "border-gray-500"
                  } focus:outline-none focus:ring-0 focus:border-green-500 peer`}
                  placeholder=" "
                />
                <label
                  htmlFor="email"
                  className="absolute text-sm text-white transition-all duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Votre Email
                </label>
                <BiUser className="absolute top-4 right-4 text-white" />
                {errors.email && touched.email && (
                  <div className="text-red-500 text-xs mt-1">{errors.email}</div>
                )}
              </div>

              {/* Password Field */}
              <div className="relative my-4">
                <Field
                  type="password"
                  name="password"
                  className={`block w-72 py-2 px-0 text-sm text-white bg-transparent border-0 border-b-2 ${
                    errors.password && touched.password
                      ? "border-red-500"
                      : "border-gray-500"
                  } focus:outline-none focus:ring-0 focus:border-green-500 peer`}
                  placeholder=" "
                />
                <label
                  htmlFor="password"
                  className="absolute text-sm text-white transition-all duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Votre Mot de passe
                </label>
                <AiOutlineLock className="absolute top-4 right-4 text-white" />
                {errors.password && touched.password && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <Field
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    className="cursor-pointer"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="text-white text-sm cursor-pointer"
                  >
                    Se souvenir de moi
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                className="w-full mt-6 mb-4 rounded-full bg-green-600 text-white hover:bg-green-700 py-2 transition-colors duration-300 disabled:bg-green-800 disabled:cursor-not-allowed"
                type="submit"
                disabled={isSubmitting || loading}
              >
                {loading ? "Connexion..." : "Se connecter"}
              </button>

              {/* Link to Register Page */}
              <div className="text-center">
                <span className="text-white text-sm">
                  Nouveau ici?{" "}
                  <Link className="text-green-500" to="/register">
                    Créer un compte
                  </Link>
                </span>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginPage;