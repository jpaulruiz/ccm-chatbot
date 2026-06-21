import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CCM Chatbots',
  description: 'AI chatbot builder for childcare',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">{children}</body>
    </html>
  );
}
