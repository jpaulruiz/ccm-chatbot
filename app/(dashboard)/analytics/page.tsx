import { getBots, getLeads } from '@/lib/db';
import { slugDomain } from '@/lib/format';
import { AnalyticsClient, type SiteStat } from './AnalyticsClient';

export const metadata = { title: 'Analytics — CM Chatbots' };
export const dynamic = 'force-dynamic';

export default function AnalyticsPage() {
  const bots = getBots();
  const leads = getLeads();
  const sites: SiteStat[] = bots.map((b) => ({
    id: b.id,
    name: b.name,
    domain: slugDomain(b.name),
    conversations: b.messageCount || 0,
    leads: leads.filter((l) => l.botId === b.id).length,
  }));

  return <AnalyticsClient sites={sites} />;
}
