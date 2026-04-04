import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'F-Source — RRHH',
  description: 'Plataforma de gestión de recursos humanos',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
