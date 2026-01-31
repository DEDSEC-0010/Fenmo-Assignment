// Expense types matching backend API
export interface Expense {
    id: string;
    amount: number;
    amountRaw: number;
    category: string;
    description: string;
    date: string;
    createdAt: string;
}

export interface CreateExpenseInput {
    amount: number;
    category: string;
    description: string;
    date: string;
}

export interface ExpensesResponse {
    success: boolean;
    data: Expense[];
    count: number;
}

export interface CreateExpenseResponse {
    success: boolean;
    data: Expense;
}

export interface CategorySummary {
    category: string;
    total: number;
}

export interface SummaryResponse {
    success: boolean;
    data: CategorySummary[];
}

export interface ApiError {
    error: {
        message: string;
        code?: string;
        details?: Array<{
            field: string;
            message: string;
        }>;
    };
}

// Available expense categories
export const EXPENSE_CATEGORIES = [
    'Food',
    'Transport',
    'Shopping',
    'Bills',
    'Entertainment',
    'Health',
    'Other',
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
