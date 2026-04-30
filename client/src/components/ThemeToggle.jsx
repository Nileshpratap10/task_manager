import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all group shadow-sm border border-gray-200 dark:border-slate-700"
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDarkMode ? (
        <Sun size={20} className="group-hover:rotate-45 transition-transform duration-500 text-amber-400" />
      ) : (
        <Moon size={20} className="group-hover:-rotate-12 transition-transform duration-500 text-blue-600" />
      )}
    </button>
  );
};

export default ThemeToggle;
