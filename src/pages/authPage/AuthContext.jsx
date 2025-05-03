import { createContext, useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";

// Create context
const AuthContext = createContext();

// Create provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on component mount
  useEffect(() => {
    const checkUserLoggedIn = () => {
      try {
        // Check localStorage first, then sessionStorage
        const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
        
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setCurrentUser(user);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  // Login function
  const login = async (email, password, rememberMe) => {
    try {
      // Get user from JSON server
      const response = await fetch(`http://localhost:3001/users?email=${email}`);
      const users = await response.json();

      // Check if user exists and password matches
      if (users.length === 0 || users[0].password !== password) {
        toast.error("Email ou mot de passe incorrect");
        return false;
      }

      const user = {
        id: users[0].id,
        username: users[0].username,
        email: users[0].email
      };

      // Store user data based on remember me option
      if (rememberMe) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        sessionStorage.setItem("user", JSON.stringify(user));
      }

      // Update state
      setCurrentUser(user);
      toast.success("Connexion réussie!");
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Erreur de connexion au serveur");
      return false;
    }
  };

  // Logout function
  const logout = () => {
    // Remove user from storage
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    
    // Update state
    setCurrentUser(null);
    toast.info("Déconnexion réussie");
  };

  // Register function
  const register = async (userData) => {
    try {
      // Check if user already exists
      const checkResponse = await fetch(`http://localhost:3001/users?email=${userData.email}`);
      const existingUsers = await checkResponse.json();

      if (existingUsers.length > 0) {
        toast.error("Cet email est déjà utilisé");
        return false;
      }

      // Create new user
      const response = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          password: userData.password,
          createdAt: new Date().toISOString()
        }),
      });

      if (response.ok) {
        toast.success("Inscription réussie!");
        return true;
      } else {
        toast.error("Erreur lors de l'inscription");
        return false;
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Erreur de connexion au serveur");
      return false;
    }
  };

  // Context value
  const value = {
    currentUser,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!currentUser
  };

  // Return provider
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;