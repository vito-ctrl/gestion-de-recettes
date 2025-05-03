import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Import your components
import LoginPage from "./pages/authPage/LoginPage";
import RegisterPage from "./pages/authPage/RegisterPage";
import HomePage from "./pages/Home";
// import ProfilePage from "./pages/ProfilePage";
// import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./pages/authPage/ProtectedRoute";
import Form from "./pages/RecettForm";
import RecipeDetails from "./pages/RecipeDetails"

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={2000} />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected routes - nested inside the ProtectedRoute component */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/form" element={<Form/>}/>
          <Route path="/Details/:id" element={<RecipeDetails/>}/>
          {/* <Route path="/profile" element={<ProfilePage />} /> */}
          {/* Add more protected routes here */}
        </Route>
        
        {/* 404 route */}
        {/* <Route path="/404" element={<NotFoundPage />} /> */}
        {/* <Route path="*" element={<Navigate to="/404" replace />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;