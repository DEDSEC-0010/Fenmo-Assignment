import type { Expense } from '../types/expense';
import { formatCurrency, formatDate } from '../hooks/useExpenses';
import './ExpenseList.css';

interface ExpenseListProps {
    expenses: Expense[];
    isLoading: boolean;
    error: Error | null;
}

// Category emoji map for visual flair
const categoryEmoji: Record<string, string> = {
    Food: '🍔',
    Transport: '🚗',
    Shopping: '🛍️',
    Bills: '📄',
    Entertainment: '🎬',
    Health: '💊',
    Other: '📦',
};

export function ExpenseList({ expenses, isLoading, error }: ExpenseListProps) {
    if (isLoading) {
        return (
            <div className="expense-list-container">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading expenses...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="expense-list-container">
                <div className="error-state">
                    <span className="error-icon">⚠️</span>
                    <p>Failed to load expenses</p>
                    <span className="error-detail">{error.message}</span>
                </div>
            </div>
        );
    }

    if (expenses.length === 0) {
        return (
            <div className="expense-list-container">
                <div className="empty-state">
                    <span className="empty-icon">📝</span>
                    <p>No expenses yet</p>
                    <span className="empty-hint">Add your first expense above!</span>
                </div>
            </div>
        );
    }

    return (
        <div className="expense-list-container">
            <div className="expense-list">
                {expenses.map((expense) => (
                    <div key={expense.id} className="expense-card">
                        <div className="expense-emoji">
                            {categoryEmoji[expense.category] || '📦'}
                        </div>
                        <div className="expense-details">
                            <div className="expense-header">
                                <span className="expense-description">{expense.description}</span>
                                <span className="expense-amount">{formatCurrency(expense.amount)}</span>
                            </div>
                            <div className="expense-meta">
                                <span className="expense-category">{expense.category}</span>
                                <span className="expense-date">{formatDate(expense.date)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
