import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import expensesRouter from './routes/expenses';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { prisma, cleanupOldIdempotencyKeys } from './services/expenseService';

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
    cors({
        origin: [FRONTEND_URL, 'http://localhost:5173', 'http://localhost:3000'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'X-Idempotency-Key'],
        credentials: true,
    })
);

// Body parsing
app.use(express.json());

// Request logging (simple)
app.use((req, _res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
});

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/expenses', expensesRouter);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Cleanup old idempotency keys every hour
const cleanupInterval = setInterval(
    async () => {
        try {
            const deleted = await cleanupOldIdempotencyKeys();
            if (deleted > 0) {
                console.log(`Cleaned up ${deleted} old idempotency keys`);
            }
        } catch (error) {
            console.error('Failed to cleanup idempotency keys:', error);
        }
    },
    60 * 60 * 1000 // 1 hour
);

// Graceful shutdown
async function shutdown() {
    console.log('Shutting down...');
    clearInterval(cleanupInterval);
    await prisma.$disconnect();
    process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Expense Tracker API running on http://localhost:${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 CORS enabled for: ${FRONTEND_URL}`);
});

export default app;
