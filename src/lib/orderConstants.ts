/**
 * Shared order status constants used across admin dashboard and orders pages.
 * Matches the backend Order model enum exactly (capitalized).
 */
export const ALL_STATUSES = [
    'Pending',
    'Confirmed',
    'Shipped',
    'Delivered',
    'Cancelled',
] as const;

export type OrderStatus = (typeof ALL_STATUSES)[number];

export const STATUS_COLORS: Record<string, string> = {
    Pending:   '#f0a500',
    Confirmed: '#1a6ef5',
    Shipped:   '#7b2ff7',
    Delivered: '#1e8c45',
    Cancelled: '#d00',
};
