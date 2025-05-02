import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/icons8-recipes-64.png';

const NavBar = () => {
    return (
        <header className="bg-black shadow-md">
            <nav className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-4">
                <div className="flex items-center space-x-3 mb-4 md:mb-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-400 p-0.5">
                        <img
                            src={Logo}
                            alt="logo"
                            className="rounded-full w-full h-full object-cover"
                        />
                    </div>
                    <span className="text-2xl font-bold text-gray-400">
                        L9ss<span className="text-white">o</span>us
                    </span>
                </div>

                <ul className="flex space-x-1 md:space-x-2 lg:space-x-8 text-gray-100 font-medium">
                    <li>
                        <Link to="/" className="block px-4 py-2 hover:text-gray-500 rounded-md transition-colors">
                            Accueil
                        </Link>
                    </li>
                    <li>
                        <Link to="/recettes" className="block px-4 py-2 hover:text-gray-500 rounded-md transition-colors">
                            Recettes
                        </Link>
                    </li>
                    <li>
                        <Link to="/about" className="block px-4 py-2 hover:text-gray-500  rounded-md transition-colors">
                            À propos
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default NavBar;