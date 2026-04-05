import type { Metadata } from 'next';
import './globals.css';
import './layout.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { WishlistProvider } from '@/context/WishlistContext';
import ClientLayout from '@/components/ClientLayout';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'FashionStore — Premium Fashion for Everyone',
  description: 'Shop the latest trends in men\'s, women\'s and kids\' fashion. Free shipping on orders over $50. Easy returns.',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ClientLayout>
                {children}
              </ClientLayout>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
        {/* Botpress Webchat */}
        <Script src="https://cdn.botpress.cloud/webchat/v3.6/inject.js" strategy="afterInteractive" />
        <Script src="https://files.bpcontent.cloud/2026/04/03/07/20260403070920-B2T45YY9.js" strategy="afterInteractive" defer />
      </body>
    </html>
  );
}

