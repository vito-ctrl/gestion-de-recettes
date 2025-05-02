

import React, { useRef } from 'react';
import RecetteCard from './RecetteCard';
import food from '../assets/background-recipeskingdom.png';

const Home = () => {
    const recetteCardRef = useRef(null);

    const scrollToRecetteCard = () => {
        if (recetteCardRef.current) {
            recetteCardRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-black">
            <section
                className="relative bg-cover bg-center h-screen flex items-center justify-center"
                style={{
                    backgroundImage: `url(${food})`,
                }}
            >
                <div className="absolute inset-0 bg-black opacity-60"></div>
                <div className="relative z-10 px-4 md:px-8 text-center max-w-4xl">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                        Inspirez-vous, cuisinez avec passion et savourez des moments inoubliables à table.
                    </h2>
                    <div className="mt-6">
                        <button
                            onClick={scrollToRecetteCard}
                            className="bg-gray-400 hover:bg-gray-100 text-gray-800 font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105"
                        >
                            Découvrir nos recettes
                        </button>
                    </div>
                </div>
            </section>

            <div className="py-16 px-4 md:px-8">
                <div className="text-center mb-12">
                    <h1 ref={recetteCardRef} className="text-3xl md:text-4xl font-bold text-gray-200 relative inline-block">
                        Nos Recettes
                        <span className="block h-1 w-24 bg-gray-400 mx-auto mt-3"></span>
                    </h1>
                    <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
                        Explorez notre collection de délicieuses recettes créées avec passion pour vous inspirer en cuisine.
                    </p>
                </div>
                <div>
                    <RecetteCard />
                </div>
            </div>
        </div>
    );
};

export default Home;