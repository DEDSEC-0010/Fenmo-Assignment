import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

// Custom error class for API errors
export class ApiError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public code?: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

// Error response interface
interface ErrorResponse {
    error: {
        message: string;
        code?: string;
        details?: unknown;
    };
}

/**
 * Global error handler middleware
 */
export function errorHandler(
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    console.error('Error:', err);

    // Handle Zod validation errors
    if (err instanceof ZodError) {
        const response: ErrorResponse = {
            error: {
                message: 'Validation failed',
                code: 'VALIDATION_ERROR',
                details: err.errors.map((e) => ({
                    field: e.path.join('.'),
                    message: e.message,
                })),
            },
        };
        res.status(400).json(response);
        return;
    }

    // Handle custom API errors
    if (err instanceof ApiError) {
        const response: ErrorResponse = {
            error: {
                message: err.message,
                code: err.code,
            },
        };
        res.status(err.statusCode).json(response);
        return;
    }

    // Handle unknown errors
    const response: ErrorResponse = {
        error: {
            message: process.env.NODE_ENV === 'production'
                ? 'Internal server error'
                : err.message,
            code: 'INTERNAL_ERROR',
        },
    };
    res.status(500).json(response);
}

/**
 * Not found handler
 */
export function notFoundHandler(_req: Request, res: Response): void {
    res.status(404).json({
        error: {
            message: 'Not found',
            code: 'NOT_FOUND',
        },
    });
}
