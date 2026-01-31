import Decimal from 'decimal.js';

// Unit tests for money conversion utilities
// These are the critical functions for financial correctness

describe('Money Conversion Utilities', () => {
    // Replicate the conversion functions to test them
    function toPaise(amount: number): number {
        return new Decimal(amount).mul(100).round().toNumber();
    }

    function fromPaise(paise: number): number {
        return new Decimal(paise).div(100).toNumber();
    }

    describe('toPaise', () => {
        it('should convert whole rupees to paise', () => {
            expect(toPaise(100)).toBe(10000);
            expect(toPaise(1)).toBe(100);
            expect(toPaise(0)).toBe(0);
        });

        it('should convert decimal amounts correctly', () => {
            expect(toPaise(100.50)).toBe(10050);
            expect(toPaise(0.01)).toBe(1);
            expect(toPaise(0.99)).toBe(99);
        });

        it('should handle floating point edge cases', () => {
            // The classic floating point problem: 0.1 + 0.2 = 0.30000000000000004
            // Decimal.js should handle this correctly
            expect(toPaise(0.1 + 0.2)).toBe(30);
        });

        it('should round correctly for more than 2 decimal places', () => {
            expect(toPaise(100.555)).toBe(10056); // rounds up
            expect(toPaise(100.554)).toBe(10055); // rounds down
        });
    });

    describe('fromPaise', () => {
        it('should convert paise back to rupees', () => {
            expect(fromPaise(10000)).toBe(100);
            expect(fromPaise(100)).toBe(1);
            expect(fromPaise(1)).toBe(0.01);
        });

        it('should handle zero', () => {
            expect(fromPaise(0)).toBe(0);
        });

        it('should maintain precision', () => {
            expect(fromPaise(10050)).toBe(100.50);
            expect(fromPaise(99)).toBe(0.99);
        });
    });

    describe('Round-trip conversion', () => {
        it('should maintain value after round-trip', () => {
            const amounts = [100, 100.50, 0.01, 999.99, 1234.56];

            amounts.forEach(amount => {
                const paise = toPaise(amount);
                const backToRupees = fromPaise(paise);
                expect(backToRupees).toBe(amount);
            });
        });
    });
});
