import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchExpenses, createExpense, fetchExpenseSummary } from '../api/expenses';
import type { CreateExpenseInput, Expense } from '../types/expense';

/**
 * Hook to fetch expenses with filtering and sorting
 */
export function useExpenses(filters?: { category?: string; sort?: 'date_desc' | 'date_asc' }) {
    return useQuery({
        queryKey: ['expenses', filters],
        queryFn: () => fetchExpenses(filters),
        staleTime: 30000, // Consider data fresh for 30 seconds
        refetchOnWindowFocus: true,
    });
}

/**
 * Hook to create a new expense
 */
export function useCreateExpense() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ input, idempotencyKey }: { input: CreateExpenseInput; idempotencyKey: string }) =>
            createExpense(input, idempotencyKey),
        onSuccess: () => {
            // Invalidate expenses query to refetch
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            queryClient.invalidateQueries({ queryKey: ['summary'] });
        },
    });
}

/**
 * Hook to fetch expense summary by category
 */
export function useExpenseSummary() {
    return useQuery({
        queryKey: ['summary'],
        queryFn: fetchExpenseSummary,
        staleTime: 30000,
    });
}

/**
 * Calculate total from expenses array
 */
export function calculateTotal(expenses: Expense[]): number {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

/**
 * Format currency for display (Indian Rupees)
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}
