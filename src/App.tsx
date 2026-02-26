import React, { useState } from 'react';
import { AuthForm } from './components/auth/AuthForm';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Budgets } from './pages/Budgets';
import { Analytics } from './pages/Analytics';
import { Forecast } from './pages/Forecast';
import { useAuth } from './hooks/useAuth';
import { useFinance } from './hooks/useFinance';
import { ThemeProvider } from './contexts/ThemeContext';
import { Loader2, AlertCircle } from 'lucide-react';

function AppContent() {
  const { user, isAuthenticated, loading: authLoading, signin, signup, signout } = useAuth();
  const financeData = useFinance(user?.id);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Show loading spinner while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Connecting to FinanceIQ...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthForm onSignin={signin} onSignup={signup} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            financeData={financeData} 
            onDeleteTransaction={financeData.deleteTransaction}
          />
        );
      case 'transactions':
        return (
          <Transactions
            transactions={financeData.transactions}
            onAdd={financeData.addTransaction}
            onDelete={financeData.deleteTransaction}
          />
        );
      case 'budgets':
        return (
          <Budgets
            budgets={financeData.budgets}
            transactions={financeData.transactions}
            onAdd={financeData.addBudget}
          />
        );
      case 'analytics':
        return <Analytics transactions={financeData.transactions} />;
      case 'forecast':
        return <Forecast transactions={financeData.transactions} />;
      default:
        return (
          <Dashboard 
            financeData={financeData} 
            onDeleteTransaction={financeData.deleteTransaction}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header user={user!} onSignout={signout} />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto px-6 py-8">
        {financeData.loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading your financial data...</p>
            </div>
          </div>
        ) : (
          renderContent()
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;