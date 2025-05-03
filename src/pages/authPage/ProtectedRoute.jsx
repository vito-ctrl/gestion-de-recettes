import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  // If authenticated, render the child routes (Outlet)
  // If not, redirect to login with a toast message
  if (!isAuthenticated) {
    toast.error("Veuillez vous connecter pour accéder à cette page");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;