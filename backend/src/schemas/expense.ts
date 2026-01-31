import { z } from 'zod';

// Allowed expense categories
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

// Schema for creating a new expense
export const createExpenseSchema = z.object({
    amount: z
        .number()
        .positive('Amount must be positive')
        .max(100000000, 'Amount is too large'), // Max 10 lakh rupees
    category: z.enum(EXPENSE_CATEGORIES, {
        errorMap: () => ({ message: 'Invalid category' }),
    }),
    description: z
        .string()
        .min(1, 'Description is required')
        .max(500, 'Description is too long'),
    date: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format')
        .transform((val) => new Date(val)),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;

// Schema for query parameters when fetching expenses
export const getExpensesQuerySchema = z.object({
    category: z.enum(EXPENSE_CATEGORIES).optional(),
    sort: z.enum(['date_desc', 'date_asc']).optional().default('date_desc'),
});

export type GetExpensesQuery = z.infer<typeof getExpensesQuerySchema>;

// Response type for expense (with amount as display value)
export interface ExpenseResponse {
    id: string;
    amount: number; // Decimal amount (e.g., 100.50)
    amountRaw: number; // Raw amount in paise (e.g., 10050)
    category: string;
    description: string;
    date: string;
    createdAt: string;
}
