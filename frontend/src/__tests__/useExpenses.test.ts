import { describe, it, expect } from 'vitest';
import { calculateTotal, formatCurrency, formatDate } from '../hooks/useExpenses';
import type { Expense } from '../types/expense';

describe('useExpenses utilities', () => {
    describe('calculateTotal', () => {
        it('should return 0 for empty array', () => {
            expect(calculateTotal([])).toBe(0);
        });

        it('should sum single expense', () => {
            const expenses: Expense[] = [
                {
                    id: '1',
                    amount: 100.50,
                    amountRaw: 10050,
                    category: 'Food',
                    description: 'Test',
                    date: '2024-01-15T12:00:00Z',
                    createdAt: '2024-01-15T12:00:00Z',
                },
            ];
            expect(calculateTotal(expenses)).toBe(100.50);
        });

        it('should sum multiple expenses', () => {
            const expenses: Expense[] = [
                {
                    id: '1',
                    amount: 100,
                    amountRaw: 10000,
                    category: 'Food',
                    description: 'Test 1',
                    date: '2024-01-15T12:00:00Z',
                    createdAt: '2024-01-15T12:00:00Z',
                },
                {
                    id: '2',
                    amount: 50.50,
                    amountRaw: 5050,
                    category: 'Transport',
                    description: 'Test 2',
                    date: '2024-01-15T12:00:00Z',
                    createdAt: '2024-01-15T12:00:00Z',
                },
                {
                    id: '3',
                    amount: 25.25,
                    amountRaw: 2525,
                    category: 'Shopping',
                    description: 'Test 3',
                    date: '2024-01-15T12:00:00Z',
                    createdAt: '2024-01-15T12:00:00Z',
                },
            ];
            expect(calculateTotal(expenses)).toBe(175.75);
        });
    });

    describe('formatCurrency', () => {
        it('should format as Indian Rupees', () => {
            const formatted = formatCurrency(1000);
            expect(formatted).toContain('₹');
            expect(formatted).toContain('1,000');
        });

        it('should show 2 decimal places', () => {
            const formatted = formatCurrency(100.5);
            expect(formatted).toContain('100.50');
        });

        it('should handle zero', () => {
            const formatted = formatCurrency(0);
            expect(formatted).toContain('0.00');
        });

        it('should format large numbers with Indian comma system', () => {
            const formatted = formatCurrency(100000);
            // Indian system: 1,00,000
            expect(formatted).toContain('1,00,000');
        });
    });

    describe('formatDate', () => {
        it('should format date in readable format', () => {
            const formatted = formatDate('2024-01-15T12:00:00Z');
            expect(formatted).toContain('2024');
            expect(formatted).toContain('Jan');
            expect(formatted).toContain('15');
        });

        it('should handle different dates', () => {
            const formatted = formatDate('2024-12-25T00:00:00Z');
            expect(formatted).toContain('Dec');
            expect(formatted).toContain('25');
        });
    });
});
