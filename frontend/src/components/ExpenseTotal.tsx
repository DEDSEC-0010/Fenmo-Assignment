import { formatCurrency } from '../hooks/useExpenses';
import './ExpenseTotal.css';

interface ExpenseTotalProps {
    total: number;
    count: number;
}

export function ExpenseTotal({ total, count }: ExpenseTotalProps) {
    return (
        <div className="expense-total">
            <div className="total-info">
                <span className="total-label">Total Expenses</span>
                <span className="expense-count">
                    {count} {count === 1 ? 'expense' : 'expenses'}
                </span>
            </div>
            <div className="total-amount">{formatCurrency(total)}</div>
        </div>
    );
}
