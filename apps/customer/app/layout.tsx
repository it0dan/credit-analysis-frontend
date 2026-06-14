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
  title: 'Análise de Crédito Agêntica — Portal do Cliente',
  description: 'Solicite e acompanhe sua proposta de crédito em tempo real',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${jetbrainsMono.variable}`}>
        <DebugProvider defaultEnabled={false}>{children}</DebugProvider>
      </body>
    </html>
  );
}
