import { getBot } from '@/lib/db';
import { notFound } from 'next/navigation';
import EmbedChat from './EmbedChat';

export const dynamic = 'force-dynamic';

export default async function EmbedPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bot = getBot(id);
  if (!bot) notFound();
  return <EmbedChat bot={bot} />;
}
