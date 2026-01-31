import { describe, it, expect } from 'vitest';
import { EXPENSE_CATEGORIES } from '../types/expense';

describe('Expense Types', () => {
    describe('EXPENSE_CATEGORIES', () => {
        it('should be a readonly array', () => {
            expect(Array.isArray(EXPENSE_CATEGORIES)).toBe(true);
        });

        it('should contain all expected categories', () => {
            const expectedCategories = [
                'Food',
                'Transport',
                'Shopping',
                'Bills',
                'Entertainment',
                'Health',
                'Other',
            ];

            expectedCategories.forEach((category) => {
                expect(EXPENSE_CATEGORIES).toContain(category);
            });
        });

        it('should have exactly 7 categories', () => {
            expect(EXPENSE_CATEGORIES.length).toBe(7);
        });

        it('categories should be unique', () => {
            const uniqueCategories = new Set(EXPENSE_CATEGORIES);
            expect(uniqueCategories.size).toBe(EXPENSE_CATEGORIES.length);
        });
    });
});
