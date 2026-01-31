import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useCreateExpense } from '../hooks/useExpenses';
import { EXPENSE_CATEGORIES } from '../types/expense';
import type { CreateExpenseInput } from '../types/expense';
import './ExpenseForm.css';

interface ExpenseFormProps {
    onSuccess?: () => void;
}

export function ExpenseForm({ onSuccess }: ExpenseFormProps) {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState<string>(EXPENSE_CATEGORIES[0]);
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Store idempotency key per form submission attempt
    const idempotencyKeyRef = useRef<string>(uuidv4());

    const createExpense = useCreateExpense();

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Amount validation
        const amountNum = parseFloat(amount);
        if (!amount || isNaN(amountNum)) {
            newErrors.amount = 'Amount is required';
        } else if (amountNum <= 0) {
            newErrors.amount = 'Amount must be positive';
        } else if (amountNum > 10000000) {
            newErrors.amount = 'Amount is too large (max ₹1 crore)';
        }

        // Description validation
        if (!description.trim()) {
            newErrors.description = 'Description is required';
        } else if (description.length > 500) {
            newErrors.description = 'Description is too long (max 500 characters)';
        }

        // Date validation
        if (!date) {
            newErrors.date = 'Date is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const input: CreateExpenseInput = {
            amount: parseFloat(amount),
            category,
            description: description.trim(),
            date: new Date(date).toISOString(),
        };

        try {
            await createExpense.mutateAsync({
                input,
                idempotencyKey: idempotencyKeyRef.current,
            });

            // Reset form on success
            setAmount('');
            setDescription('');
            setDate(new Date().toISOString().split('T')[0]);
            setCategory(EXPENSE_CATEGORIES[0]);
            setErrors({});

            // Generate new idempotency key for next submission
            idempotencyKeyRef.current = uuidv4();

            onSuccess?.();
        } catch (error) {
            // Error is handled by React Query
            console.error('Failed to create expense:', error);
        }
    };

    const isSubmitting = createExpense.isPending;

    return (
        <form className="expense-form" onSubmit={handleSubmit}>
            <h2>Add New Expense</h2>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="amount">Amount (₹)</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        min="0.01"
                        disabled={isSubmitting}
                        className={errors.amount ? 'error' : ''}
                    />
                    {errors.amount && <span className="error-message">{errors.amount}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        disabled={isSubmitting}
                    >
                        {EXPENSE_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                    type="text"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What did you spend on?"
                    maxLength={500}
                    disabled={isSubmitting}
                    className={errors.description ? 'error' : ''}
                />
                {errors.description && <span className="error-message">{errors.description}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    disabled={isSubmitting}
                    className={errors.date ? 'error' : ''}
                />
                {errors.date && <span className="error-message">{errors.date}</span>}
            </div>

            <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <>
                        <span className="spinner"></span>
                        Adding...
                    </>
                ) : (
                    'Add Expense'
                )}
            </button>

            {createExpense.isError && (
                <div className="form-error">
                    Failed to add expense. Please try again.
                </div>
            )}

            {createExpense.isSuccess && (
                <div className="form-success">
                    Expense added successfully!
                </div>
            )}
        </form>
    );
}
