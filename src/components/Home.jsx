import React from 'react';
import RecetteCard from './RecetteCard';

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Nos Recettes</h1>
            <RecetteCard />
        </div>
    );
};

export default Home;
