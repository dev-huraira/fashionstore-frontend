'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import { Suspense } from 'react';

function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isAdmin = pathname?.startsWith('/admin');
    const isGuest = searchParams?.get('guest') === '1';

    if (isAdmin) {
        // Admin pages: no Navbar, no Footer, no Chatbot, no layout wrapper padding
        return <>{children}</>;
    }

    return (
        <div className={`layout${isGuest ? ' guest-mode' : ''}`}>
            <Navbar guestMode={isGuest} />
            <main className="main-content">
                {children}
            </main>
            <Footer />

        </div>
    );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={<div className="layout"><main className="main-content">{children}</main></div>}>
            <LayoutContent>{children}</LayoutContent>
        </Suspense>
    );
}
