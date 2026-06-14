import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { DebugProvider } from '@repo/ui/debug-context';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: ['200', '300', '400', '500'],
  variable: '--font-jetbrains',
});

export const metadata: Metadata = {
  title: 'Crédito A2A — Cockpit Operacional',
  description: 'Central técnica para análise de crédito multiagente',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${jetbrainsMono.variable}`}>
        <DebugProvider defaultEnabled={true}>{children}</DebugProvider>
      </body>
    </html>
  );
}
