import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CCM Chatbots',
  description: 'AI chatbot builder for childcare',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0b0f17] text-[#eef2f8] antialiased">{children}</body>
    </html>
  );
}
