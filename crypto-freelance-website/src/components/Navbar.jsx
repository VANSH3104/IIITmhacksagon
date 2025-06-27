import React from 'react';
import { useTheme } from 'next-themes';
import { FiMoon, FiSun } from 'react-icons/fi';

const Navbar = () => {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-gray-900 dark:text-white">
          Crypto Freelance
        </div>
        <div className="flex items-center space-x-4">
          <a href="#jobs" className="text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400">Jobs</a>
          <a href="#about" className="text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400">About</a>
          <a href="#contact" className="text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400">Contact</a>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {theme === 'dark' ? (
              <FiSun className="h-5 w-5 text-yellow-400" />
            ) : (
              <FiMoon className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;