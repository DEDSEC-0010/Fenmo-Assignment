import { PrismaClient, Expense, Prisma } from '@prisma/client';
import Decimal from 'decimal.js';
import { CreateExpenseInput, GetExpensesQuery, ExpenseResponse } from '../schemas/expense';

const prisma = new PrismaClient();

// Configure Decimal.js for financial calculations
Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

/**
 * Convert decimal amount to paise/cents for storage
 * This avoids floating-point precision issues
 */
function toPaise(amount: number): number {
    return new Decimal(amount).mul(100).round().toNumber();
}

/**
 * Convert paise/cents back to decimal amount for display
 */
function fromPaise(paise: number): number {
    return new Decimal(paise).div(100).toNumber();
}

/**
 * Transform database expense to API response format
 */
function toExpenseResponse(expense: Expense): ExpenseResponse {
    return {
        id: expense.id,
        amount: fromPaise(expense.amount),
        amountRaw: expense.amount,
        category: expense.category,
        description: expense.description,
        date: expense.date.toISOString(),
        createdAt: expense.createdAt.toISOString(),
    };
}

/**
 * Create a new expense with idempotency support
 * If the same idempotency key is used, return the existing expense
 */
export async function createExpense(
    input: CreateExpenseInput,
    idempotencyKey: string
): Promise<ExpenseResponse> {
    // Check if we already processed this request
    const existingKey = await prisma.idempotencyKey.findUnique({
        where: { key: idempotencyKey },
    });

    if (existingKey) {
        // Return the existing expense
        const existingExpense = await prisma.expense.findUnique({
            where: { id: existingKey.expenseId },
        });

        if (existingExpense) {
            return toExpenseResponse(existingExpense);
        }
        // If expense was somehow deleted, we'll create a new one
    }

    // Convert amount to paise for storage
    const amountInPaise = toPaise(input.amount);

    // Create expense and idempotency key in a transaction
    const expense = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const newExpense = await tx.expense.create({
            data: {
                amount: amountInPaise,
                category: input.category,
                description: input.description,
                date: input.date,
            },
        });

        // Store idempotency key
        await tx.idempotencyKey.create({
            data: {
                key: idempotencyKey,
                expenseId: newExpense.id,
            },
        });

        return newExpense;
    });

    return toExpenseResponse(expense);
}

/**
 * Get expenses with optional filtering and sorting
 */
export async function getExpenses(query: GetExpensesQuery): Promise<ExpenseResponse[]> {
    const { category, sort } = query;

    const expenses = await prisma.expense.findMany({
        where: category ? { category } : undefined,
        orderBy: {
            date: sort === 'date_asc' ? 'asc' : 'desc',
        },
    });

    return expenses.map(toExpenseResponse);
}

/**
 * Get summary of expenses by category
 */
export async function getExpenseSummary(): Promise<{ category: string; total: number }[]> {
    const summary = await prisma.expense.groupBy({
        by: ['category'],
        _sum: {
            amount: true,
        },
        orderBy: {
            _sum: {
                amount: 'desc',
            },
        },
    });

    return summary.map((item) => ({
        category: item.category,
        total: fromPaise(item._sum.amount || 0),
    }));
}

/**
 * Cleanup old idempotency keys (older than 24 hours)
 * Can be called periodically
 */
export async function cleanupOldIdempotencyKeys(): Promise<number> {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const result = await prisma.idempotencyKey.deleteMany({
        where: {
            createdAt: {
                lt: twentyFourHoursAgo,
            },
        },
    });

    return result.count;
}

// Export prisma for shutdown
export { prisma };
