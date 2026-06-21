import { getBot } from '@/lib/db';
import { notFound } from 'next/navigation';
import BotDetail from './BotDetail';

export const dynamic = 'force-dynamic';

export default async function BotPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bot = getBot(id);
  if (!bot) notFound();
  return <BotDetail bot={bot} />;
}
