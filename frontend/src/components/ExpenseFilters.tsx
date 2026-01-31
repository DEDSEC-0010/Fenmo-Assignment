import { EXPENSE_CATEGORIES } from '../types/expense';
import './ExpenseFilters.css';

interface ExpenseFiltersProps {
    selectedCategory: string;
    sortOrder: 'date_desc' | 'date_asc';
    onCategoryChange: (category: string) => void;
    onSortChange: (sort: 'date_desc' | 'date_asc') => void;
}

export function ExpenseFilters({
    selectedCategory,
    sortOrder,
    onCategoryChange,
    onSortChange,
}: ExpenseFiltersProps) {
    return (
        <div className="expense-filters">
            <div className="filter-group">
                <label htmlFor="category-filter">Filter by Category</label>
                <select
                    id="category-filter"
                    value={selectedCategory}
                    onChange={(e) => onCategoryChange(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {EXPENSE_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="sort-order">Sort by Date</label>
                <select
                    id="sort-order"
                    value={sortOrder}
                    onChange={(e) => onSortChange(e.target.value as 'date_desc' | 'date_asc')}
                >
                    <option value="date_desc">Newest First</option>
                    <option value="date_asc">Oldest First</option>
                </select>
            </div>
        </div>
    );
}
