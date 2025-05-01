import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/logo.png';

const NavBar = () => {
    return (
        <header className="bg-white shadow-md">
            <div className="bg-yellow-400 h-2"></div>

            <nav className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-4">
                <div className="flex items-center space-x-3 mb-4 md:mb-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-yellow-400 p-0.5">
                        <img
                            src={Logo}
                            alt="logo"
                            className="rounded-full w-full h-full object-cover"
                        />
                    </div>
                    <span className="text-2xl font-bold text-gray-800">
                        Recett<span className="text-yellow-500">o</span>pia
                    </span>
                </div>

                <ul className="flex space-x-1 md:space-x-2 lg:space-x-8 text-gray-700 font-medium">
                    <li>
                        <Link to="/" className="block px-4 py-2 hover:text-yellow-500 hover:bg-gray-50 rounded-md transition-colors">
                            Accueil
                        </Link>
                    </li>
                    <li>
                        <Link to="/recettes" className="block px-4 py-2 hover:text-yellow-500 hover:bg-gray-50 rounded-md transition-colors">
                            Recettes
                        </Link>
                    </li>
                    <li>
                        <Link to="/about" className="block px-4 py-2 hover:text-yellow-500 hover:bg-gray-50 rounded-md transition-colors">
                            À propos
                        </Link>
                    </li>
                    <li>
                        
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default NavBar;