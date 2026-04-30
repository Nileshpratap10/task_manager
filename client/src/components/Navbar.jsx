import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, User, LogOut, CheckSquare } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <Link to="/" className="flex items-center space-x-2">
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <CheckSquare className="text-white" size={24} />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
          TeamSync
        </span>
      </Link>

      <div className="hidden md:flex items-center space-x-8">
        <Link 
          to="/dashboard" 
          className={`flex items-center space-x-2 font-medium transition-colors ${
            isActive('/dashboard') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
          }`}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>
        <Link 
          to="/projects" 
          className={`flex items-center space-x-2 font-medium transition-colors ${
            isActive('/projects') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
          }`}
        >
          <FolderKanban size={20} />
          <span>Projects</span>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <Link 
          to="/profile" 
          className="flex items-center space-x-3 p-1 pr-3 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-gray-200 dark:hover:border-slate-700"
        >
          <img 
            src={user?.avatar} 
            alt={user?.name} 
            className="w-8 h-8 rounded-full object-cover border border-gray-300"
          />
          <span className="hidden sm:inline font-medium text-gray-700">{user?.name}</span>
        </Link>
        <button 
          onClick={logout}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-500/10 rounded-lg transition-all"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
