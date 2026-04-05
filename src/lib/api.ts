/**
 * Central API base URL.
 * Set NEXT_PUBLIC_API_URL in .env.local to override (e.g. for production).
 * Falls back to localhost:5000 for local development.
 */
export const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
