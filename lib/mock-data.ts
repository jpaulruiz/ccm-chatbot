// Sample/illustrative data for charts and the idea board.
// Real entities (agents, sites, totals) are derived from data/db.json in the pages.

export const conversationsTrend = Array.from({ length: 30 }, (_, i) => {
  const base = 40 + Math.round(35 * Math.sin(i / 4) + i * 1.5);
  return {
    day: `${i + 1}`,
    conversations: base,
    resolved: Math.round(base * (0.62 + 0.15 * Math.sin(i / 3))),
  };
});

export const topIntents = [
  { intent: 'Pricing & fees', count: 1284, change: 12 },
  { intent: 'Opening hours', count: 942, change: 4 },
  { intent: 'Availability / waitlist', count: 731, change: 18 },
  { intent: 'Funding options', count: 558, change: -3 },
  { intent: 'Book a tour', count: 412, change: 27 },
];

export const agentBreakdown = [
  { name: 'Concierge', conversations: 820 },
  { name: 'Support', conversations: 540 },
  { name: 'Sales', conversations: 410 },
  { name: 'Docs', conversations: 260 },
];

export interface Idea {
  id: string;
  title: string;
  description: string;
  category: 'feature' | 'agent' | 'integration' | 'workflow';
  votes: number;
  status: 'new' | 'exploring' | 'in-progress' | 'shipped';
  author: string;
}

export const ideas: Idea[] = [
  {
    id: 'id_1',
    title: 'Let agents book nursery tours directly',
    description: 'Connect the calendar so the bot can offer real slots and confirm a visit.',
    category: 'workflow',
    votes: 42,
    status: 'exploring',
    author: 'Mira',
  },
  {
    id: 'id_2',
    title: 'WhatsApp channel for agents',
    description: 'Parents prefer WhatsApp — let the same agent answer there.',
    category: 'integration',
    votes: 31,
    status: 'new',
    author: 'Tom',
  },
  {
    id: 'id_3',
    title: 'Auto-summarise each conversation into a lead note',
    description: 'Save staff time by attaching a one-line summary to every captured lead.',
    category: 'feature',
    votes: 27,
    status: 'in-progress',
    author: 'You',
  },
  {
    id: 'id_4',
    title: 'Multilingual replies',
    description: 'Detect the visitor language and answer in it automatically.',
    category: 'agent',
    votes: 19,
    status: 'new',
    author: 'Priya',
  },
  {
    id: 'id_5',
    title: 'Embed health alerts',
    description: 'Ping Slack when a site embed stops loading.',
    category: 'feature',
    votes: 14,
    status: 'shipped',
    author: 'Tom',
  },
];
