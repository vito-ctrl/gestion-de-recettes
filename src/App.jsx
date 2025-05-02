import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import RecetteDetail from './components/RecetteDetail';
import NavBar from './components/NavBar';
import RecipeForm from './components/RecettForm';
// import Fetch from './components/importing';
function App() {
  return (
    <div className="min-h-screen w-full bg-gray-100">
      <NavBar />

      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/RecipeForm" element={<RecipeForm />} />
          {/* <Route path="/recette/det" element={<RecetteDetail />} /> */}
          <Route path="/recette/:id" element={<RecetteDetail />} />
          {/* <Route path="/Fetch" element={<Fetch />} /> */}

          {/* <Route path="/about" element={<About />} /> */}
          {/* <Route path="/contact" element={<Contact />} /> */}
          {/* <Route path="/create" element={<ArticleForm />} /> */}
          {/* <Route path="/recette/:id/edit" element={<ArticleForm />} /> */}
        
        </Routes>
      </div>
    </div>
  );
}

export default App;
