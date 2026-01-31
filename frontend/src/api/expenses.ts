import axios, { type AxiosError, type AxiosInstance } from 'axios';
import type {
    CreateExpenseInput,
    CreateExpenseResponse,
    ExpensesResponse,
    SummaryResponse,
} from '../types/expense';

// Define ApiError locally to avoid module resolution issues
interface ApiError {
    error: {
        message: string;
        code?: string;
        details?: Array<{ field: string; message: string }>;
    };
}

// API base URL - use environment variable in production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Create axios instance with default config
const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for logging
api.interceptors.request.use(
    (config) => {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiError>) => {
        if (error.response) {
            console.error('[API Error]', error.response.data);
        } else if (error.request) {
            console.error('[API Error] No response received');
        } else {
            console.error('[API Error]', error.message);
        }
        return Promise.reject(error);
    }
);

/**
 * Fetch expenses with optional filtering and sorting
 */
export async function fetchExpenses(params?: {
    category?: string;
    sort?: 'date_desc' | 'date_asc';
}): Promise<ExpensesResponse> {
    const response = await api.get<ExpensesResponse>('/expenses', { params });
    return response.data;
}

/**
 * Create a new expense with idempotency support
 */
export async function createExpense(
    input: CreateExpenseInput,
    idempotencyKey: string
): Promise<CreateExpenseResponse> {
    const response = await api.post<CreateExpenseResponse>('/expenses', input, {
        headers: {
            'X-Idempotency-Key': idempotencyKey,
        },
    });
    return response.data;
}

/**
 * Fetch expense summary by category
 */
export async function fetchExpenseSummary(): Promise<SummaryResponse> {
    const response = await api.get<SummaryResponse>('/expenses/summary');
    return response.data;
}

/**
 * Fetch available categories
 */
export async function fetchCategories(): Promise<string[]> {
    const response = await api.get<{ success: boolean; data: string[] }>('/expenses/categories');
    return response.data.data;
}

export { api };
