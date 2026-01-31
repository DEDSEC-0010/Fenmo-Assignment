import { createExpenseSchema, getExpensesQuerySchema, EXPENSE_CATEGORIES } from '../schemas/expense';

describe('Expense Schemas', () => {
    describe('createExpenseSchema', () => {
        it('should validate a valid expense input', () => {
            const validInput = {
                amount: 150.50,
                category: 'Food',
                description: 'Lunch at restaurant',
                date: '2024-01-15T12:00:00Z',
            };

            const result = createExpenseSchema.safeParse(validInput);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.amount).toBe(150.50);
                expect(result.data.category).toBe('Food');
                expect(result.data.description).toBe('Lunch at restaurant');
                expect(result.data.date).toBeInstanceOf(Date);
            }
        });

        it('should reject negative amounts', () => {
            const invalidInput = {
                amount: -50,
                category: 'Food',
                description: 'Test',
                date: '2024-01-15T12:00:00Z',
            };

            const result = createExpenseSchema.safeParse(invalidInput);
            expect(result.success).toBe(false);
        });

        it('should reject zero amount', () => {
            const invalidInput = {
                amount: 0,
                category: 'Food',
                description: 'Test',
                date: '2024-01-15T12:00:00Z',
            };

            const result = createExpenseSchema.safeParse(invalidInput);
            expect(result.success).toBe(false);
        });

        it('should reject invalid category', () => {
            const invalidInput = {
                amount: 100,
                category: 'InvalidCategory',
                description: 'Test',
                date: '2024-01-15T12:00:00Z',
            };

            const result = createExpenseSchema.safeParse(invalidInput);
            expect(result.success).toBe(false);
        });

        it('should reject empty description', () => {
            const invalidInput = {
                amount: 100,
                category: 'Food',
                description: '',
                date: '2024-01-15T12:00:00Z',
            };

            const result = createExpenseSchema.safeParse(invalidInput);
            expect(result.success).toBe(false);
        });

        it('should reject invalid date format', () => {
            const invalidInput = {
                amount: 100,
                category: 'Food',
                description: 'Test',
                date: 'not-a-date',
            };

            const result = createExpenseSchema.safeParse(invalidInput);
            expect(result.success).toBe(false);
        });

        it('should reject amount exceeding maximum', () => {
            const invalidInput = {
                amount: 200000000, // 20 crore, exceeds 10 lakh max
                category: 'Food',
                description: 'Test',
                date: '2024-01-15T12:00:00Z',
            };

            const result = createExpenseSchema.safeParse(invalidInput);
            expect(result.success).toBe(false);
        });
    });

    describe('getExpensesQuerySchema', () => {
        it('should accept empty query', () => {
            const result = getExpensesQuerySchema.safeParse({});
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.sort).toBe('date_desc'); // default
            }
        });

        it('should accept valid category filter', () => {
            const result = getExpensesQuerySchema.safeParse({ category: 'Food' });
            expect(result.success).toBe(true);
        });

        it('should accept valid sort parameter', () => {
            const result = getExpensesQuerySchema.safeParse({ sort: 'date_asc' });
            expect(result.success).toBe(true);
        });

        it('should reject invalid category', () => {
            const result = getExpensesQuerySchema.safeParse({ category: 'Invalid' });
            expect(result.success).toBe(false);
        });

        it('should reject invalid sort', () => {
            const result = getExpensesQuerySchema.safeParse({ sort: 'invalid_sort' });
            expect(result.success).toBe(false);
        });
    });

    describe('EXPENSE_CATEGORIES', () => {
        it('should contain expected categories', () => {
            expect(EXPENSE_CATEGORIES).toContain('Food');
            expect(EXPENSE_CATEGORIES).toContain('Transport');
            expect(EXPENSE_CATEGORIES).toContain('Shopping');
            expect(EXPENSE_CATEGORIES).toContain('Bills');
            expect(EXPENSE_CATEGORIES).toContain('Entertainment');
            expect(EXPENSE_CATEGORIES).toContain('Health');
            expect(EXPENSE_CATEGORIES).toContain('Other');
        });

        it('should have exactly 7 categories', () => {
            expect(EXPENSE_CATEGORIES).toHaveLength(7);
        });
    });
});
