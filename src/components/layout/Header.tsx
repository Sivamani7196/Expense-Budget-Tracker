import React from 'react';
import { TrendingUp, LogOut, User, Sun, Moon } from 'lucide-react';
import { User as UserType } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

interface HeaderProps {
  user: UserType;
  onSignout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onSignout }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 shadow-lg transition-colors duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl mr-3 shadow-lg">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              FinanceIQ
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Intelligent Personal Finance</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-2 border border-gray-200 dark:border-gray-600">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{user.name}</span>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onSignout}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md"
          >
            <LogOut className="h-4 w-4" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};