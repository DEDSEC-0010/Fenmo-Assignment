import { useExpenseSummary, formatCurrency } from '../hooks/useExpenses';
import './ExpenseSummary.css';

// Category emoji map
const categoryEmoji: Record<string, string> = {
    Food: '🍔',
    Transport: '🚗',
    Shopping: '🛍️',
    Bills: '📄',
    Entertainment: '🎬',
    Health: '💊',
    Other: '📦',
};

export function ExpenseSummary() {
    const { data, isLoading, error } = useExpenseSummary();

    if (isLoading) {
        return (
            <div className="expense-summary">
                <h3>Category Summary</h3>
                <div className="summary-loading">Loading...</div>
            </div>
        );
    }

    if (error || !data?.data.length) {
        return null;
    }

    const summary = data.data;
    const grandTotal = summary.reduce((sum, item) => sum + item.total, 0);

    return (
        <div className="expense-summary">
            <h3>Category Summary</h3>
            <div className="summary-list">
                {summary.map((item) => {
                    const percentage = grandTotal > 0 ? (item.total / grandTotal) * 100 : 0;
                    return (
                        <div key={item.category} className="summary-item">
                            <div className="summary-info">
                                <span className="summary-emoji">
                                    {categoryEmoji[item.category] || '📦'}
                                </span>
                                <span className="summary-category">{item.category}</span>
                            </div>
                            <div className="summary-bar-container">
                                <div
                                    className="summary-bar"
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                            <span className="summary-amount">{formatCurrency(item.total)}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
