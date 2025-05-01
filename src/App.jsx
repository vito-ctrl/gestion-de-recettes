import './App.css'
import { Routes, Route } from 'react-router-dom'
// import RecipeForm from './components/RecettForm'
// import RecipeForm from './components/RecettForm'
import RecetteCard from './components/RecetteCard'
import Home from './components/Home'
function App() {

  return (
    // <>
    //   {/* <div className="min-h-screen w-full bg-gray-100 p-4"><RecipeForm /></div> */}
    // <RecetteCard/>
    // </>
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/recette/:id" element={<RecetteDetail />} /> */}
      {/* <Route path="/recette" element={<RecetteCard />} /> */}
    </Routes>
  )
}

export default App
