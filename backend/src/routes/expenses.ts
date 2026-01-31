import { Router, Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
    createExpenseSchema,
    getExpensesQuerySchema,
    EXPENSE_CATEGORIES,
} from '../schemas/expense';
import {
    createExpense,
    getExpenses,
    getExpenseSummary,
} from '../services/expenseService';
import { ApiError } from '../middleware/errorHandler';

const router = Router();

/**
 * POST /expenses
 * Create a new expense
 * 
 * Headers:
 *   X-Idempotency-Key: string (optional, will be generated if not provided)
 * 
 * Body:
 *   amount: number (positive)
 *   category: string (one of predefined categories)
 *   description: string
 *   date: string (ISO date format)
 */
router.post(
    '/',
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Get or generate idempotency key
            let idempotencyKey = req.headers['x-idempotency-key'] as string;

            if (!idempotencyKey) {
                // If no key provided, generate one (less safe for retries)
                idempotencyKey = uuidv4();
            }

            // Validate request body
            const validatedData = createExpenseSchema.parse(req.body);

            // Create expense
            const expense = await createExpense(validatedData, idempotencyKey);

            res.status(201).json({
                success: true,
                data: expense,
            });
        } catch (error) {
            next(error);
        }
    }
);

/**
 * GET /expenses
 * Get list of expenses with optional filtering and sorting
 * 
 * Query params:
 *   category: string (optional, filter by category)
 *   sort: 'date_desc' | 'date_asc' (optional, default: date_desc)
 */
router.get(
    '/',
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Validate query parameters
            const query = getExpensesQuerySchema.parse(req.query);

            // Get expenses
            const expenses = await getExpenses(query);

            res.json({
                success: true,
                data: expenses,
                count: expenses.length,
            });
        } catch (error) {
            next(error);
        }
    }
);

/**
 * GET /expenses/summary
 * Get expense summary by category
 */
router.get(
    '/summary',
    async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const summary = await getExpenseSummary();

            res.json({
                success: true,
                data: summary,
            });
        } catch (error) {
            next(error);
        }
    }
);

/**
 * GET /expenses/categories
 * Get list of available categories
 */
router.get('/categories', (_req: Request, res: Response): void => {
    res.json({
        success: true,
        data: EXPENSE_CATEGORIES,
    });
});

export default router;
