import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseFilters } from './components/ExpenseFilters';
import { ExpenseTotal } from './components/ExpenseTotal';
import { ExpenseSummary } from './components/ExpenseSummary';
import { useExpenses, calculateTotal } from './hooks/useExpenses';
import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30000,
    },
    mutations: {
      retry: 1,
    },
  },
});

function ExpenseTracker() {
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortOrder, setSortOrder] = useState<'date_desc' | 'date_asc'>('date_desc');

  const { data, isLoading, error } = useExpenses({
    category: categoryFilter || undefined,
    sort: sortOrder,
  });

  const expenses = data?.data ?? [];
  const total = calculateTotal(expenses);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>💰 Expense Tracker</h1>
          <p className="tagline">Track your spending, master your finances</p>
        </div>
      </header>

      <main className="app-main">
        <div className="content-wrapper">
          <section className="form-section">
            <ExpenseForm />
          </section>

          <section className="list-section">
            <ExpenseTotal total={total} count={expenses.length} />

            <ExpenseFilters
              selectedCategory={categoryFilter}
              sortOrder={sortOrder}
              onCategoryChange={setCategoryFilter}
              onSortChange={setSortOrder}
            />

            <ExpenseList
              expenses={expenses}
              isLoading={isLoading}
              error={error}
            />

            <ExpenseSummary />
          </section>
        </div>
      </main>

      <footer className="app-footer">
        <p>Built with ❤️ for tracking expenses</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ExpenseTracker />
    </QueryClientProvider>
  );
}

export default App;
