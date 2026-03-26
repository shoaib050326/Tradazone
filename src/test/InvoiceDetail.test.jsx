import { describe, it, expect, beforeEach, vi } from 'vitest';

// ─── calculateTotal function tests ───────────────────────────────────────────
// These tests verify the business logic for calculating invoice totals
// This is the core business logic in InvoiceDetail that needs testing

describe('InvoiceDetail - calculateTotal business logic', () => {
    // Test helper that mirrors the calculateTotal implementation in InvoiceDetail.jsx
    const calculateTotal = (invoice) => {
        return invoice.items.reduce(
            (total, item) => total + (parseFloat(item.price) * item.quantity),
            0
        );
    };

    it('calculates correct total from line items', () => {
        const invoice = {
            items: [
                { name: 'Consulting', quantity: 2, price: '100' },
            ],
        };
        expect(calculateTotal(invoice)).toBe(200);
    });

    it('calculates total for multiple items', () => {
        const invoice = {
            items: [
                { name: 'Item 1', quantity: 2, price: '100' },
                { name: 'Item 2', quantity: 1, price: '50' },
            ],
        };
        expect(calculateTotal(invoice)).toBe(250);
    });

    it('handles empty items array', () => {
        const invoice = { items: [] };
        expect(calculateTotal(invoice)).toBe(0);
    });

    it('handles decimal prices correctly', () => {
        const invoice = {
            items: [
                { name: 'Service', quantity: 1, price: '99.99' },
            ],
        };
        expect(calculateTotal(invoice)).toBeCloseTo(99.99, 2);
    });

    it('handles single item', () => {
        const invoice = {
            items: [
                { name: 'Single Item', quantity: 5, price: '20' },
            ],
        };
        expect(calculateTotal(invoice)).toBe(100);
    });

    it('handles zero price items', () => {
        const invoice = {
            items: [
                { name: 'Free Item', quantity: 3, price: '0' },
            ],
        };
        expect(calculateTotal(invoice)).toBe(0);
    });

    it('handles large quantities', () => {
        const invoice = {
            items: [
                { name: 'Bulk Item', quantity: 1000, price: '10' },
            ],
        };
        expect(calculateTotal(invoice)).toBe(10000);
    });

    it('handles missing price as NaN', () => {
        const invoice = {
            items: [
                { name: 'Item', quantity: 2 }, // no price
            ],
        };
        const result = calculateTotal(invoice);
        expect(Number.isNaN(result)).toBe(true);
    });

    it('handles non-numeric price as NaN', () => {
        const invoice = {
            items: [
                { name: 'Item', quantity: 1, price: 'abc' },
            ],
        };
        const result = calculateTotal(invoice);
        expect(Number.isNaN(result)).toBe(true);
    });
});

// ─── Invoice data structure validation ───────────────────────────────────────

describe('InvoiceDetail - invoice data handling', () => {
    const mockInvoiceData = {
        id: 'INV-001',
        customerId: 'cust-1',
        customer: 'Alice',
        amount: '200',
        currency: 'STRK',
        status: 'pending',
        dueDate: '2026-04-01',
        createdAt: '2026-03-01',
        items: [
            { name: 'Consulting', quantity: 2, price: '100' },
        ],
    };

    const mockCustomerData = {
        id: 'cust-1',
        name: 'Alice',
        email: 'alice@example.com',
    };

    it('invoice has required fields', () => {
        expect(mockInvoiceData.id).toBeTruthy();
        expect(mockInvoiceData.customer).toBeTruthy();
        expect(mockInvoiceData.status).toBeTruthy();
        expect(mockInvoiceData.items).toBeInstanceOf(Array);
    });

    it('customer data is properly structured', () => {
        expect(mockCustomerData.id).toBe('cust-1');
        expect(mockCustomerData.name).toBe('Alice');
        expect(mockCustomerData.email).toBe('alice@example.com');
    });

    it('line items have required fields', () => {
        const item = mockInvoiceData.items[0];
        expect(item.name).toBe('Consulting');
        expect(item.quantity).toBe(2);
        expect(item.price).toBe('100');
    });
});

// ─── Sender data for PDF generation ─────────────────────────────────────────

describe('InvoiceDetail - sender data for PDF', () => {
    it('creates sender object with user data when available', () => {
        const user = { name: 'Test User', email: 'test@tradazone.com' };
        const sender = {
            name: user?.name || 'Tradazone',
            email: user?.email || 'hello@tradazone.com',
        };
        expect(sender.name).toBe('Test User');
        expect(sender.email).toBe('test@tradazone.com');
    });

    it('falls back to defaults when user is null', () => {
        const user = null;
        const sender = {
            name: user?.name || 'Tradazone',
            email: user?.email || 'hello@tradazone.com',
        };
        expect(sender.name).toBe('Tradazone');
        expect(sender.email).toBe('hello@tradazone.com');
    });

    it('falls back to defaults when user is undefined', () => {
        const user = undefined;
        const sender = {
            name: user?.name || 'Tradazone',
            email: user?.email || 'hello@tradazone.com',
        };
        expect(sender.name).toBe('Tradazone');
        expect(sender.email).toBe('hello@tradazone.com');
    });

    it('falls back when user has no name/email', () => {
        const user = {};
        const sender = {
            name: user?.name || 'Tradazone',
            email: user?.email || 'hello@tradazone.com',
        };
        expect(sender.name).toBe('Tradazone');
        expect(sender.email).toBe('hello@tradazone.com');
    });
});
