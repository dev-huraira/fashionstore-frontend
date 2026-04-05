import type { ReactNode } from 'react';
import './page.css';

/**
 * Shared layout for all /admin/* pages.
 * Imports page.css once here instead of in every individual admin page.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
