import Link from 'next/link';
import { getBots, getLeads } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PageHeader } from '@/components/page-header';
import { AreaTrend } from '@/components/charts/area-trend';
import { conversationsTrend, topIntents } from '@/lib/mock-data';
import { initials, relativeTime, slugDomain } from '@/lib/format';
import { Activity, ArrowUpRight, Bot, Globe, MessageSquare, Sparkles, Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

function Stat({
  label,
  value,
  delta,
  icon: Icon,
}: {
  label: string;
  value: string;
  delta: string;
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
            <p className="mt-2 font-display text-3xl font-semibold tracking-tight">{value}</p>
          </div>
          <div className="grid size-9 place-items-center rounded-md bg-accent text-accent-foreground">
            <Icon className="size-4" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1 text-xs">
          <ArrowUpRight className="size-3.5 text-success" />
          <span className="text-success">{delta}</span>
          <span className="text-muted-foreground">vs last 30d</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const bots = getBots();
  const leads = getLeads();
  const totalConversations = bots.reduce((s, b) => s + (b.messageCount || 0), 0);
  const recent = [...bots].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8">
      <PageHeader
        eyebrow="Workspace · Childcare Marketing"
        title="Good morning"
        description={`${bots.length} agent${bots.length !== 1 ? 's' : ''} answering across your sites, ${leads.length} lead${leads.length !== 1 ? 's' : ''} captured.`}
        actions={
          <>
            <Button asChild variant="outline" size="sm">
              <Link href="/analytics">View analytics</Link>
            </Button>
            <Button asChild size="sm" className="gap-1.5">
              <Link href="/chatbots/new">
                <Sparkles className="size-4" /> Draft a new agent
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Conversations" value={totalConversations.toLocaleString()} delta="+18%" icon={MessageSquare} />
        <Stat label="Active agents" value={`${bots.length}`} delta="+1" icon={Bot} />
        <Stat label="Leads captured" value={`${leads.length}`} delta="+4" icon={Users} />
        <Stat label="Live sites" value={`${bots.length}`} delta="+0" icon={Activity} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-display">Conversations · last 30 days</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Total volume vs auto-resolved by your agents (illustrative).
              </p>
            </div>
            <Badge variant="secondary" className="rounded-full">Live</Badge>
          </CardHeader>
          <CardContent>
            <AreaTrend data={conversationsTrend} height={288} idPrefix="overview" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display">Top intents</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">What people are asking this month.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {topIntents.map((t) => (
              <div key={t.intent} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{t.intent}</span>
                  <span className="tabular-nums text-muted-foreground">{t.count.toLocaleString()}</span>
                </div>
                <Progress value={(t.count / topIntents[0].count) * 100} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display">Connected sites</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/sites">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            {recent.slice(0, 4).map((b) => (
              <div key={b.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">{b.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{slugDomain(b.name)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm tabular-nums text-muted-foreground">
                    {(b.messageCount || 0).toLocaleString()} chats
                  </span>
                  <Badge variant="outline" className="border-success/30 bg-success/10 text-success">
                    healthy
                  </Badge>
                </div>
              </div>
            ))}
            {recent.length === 0 ? (
              <p className="py-3 text-sm text-muted-foreground">No sites connected yet.</p>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display">Recently updated agents</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/agents">Open agents</Link>
            </Button>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            {recent.slice(0, 4).map((b) => (
              <Link
                key={b.id}
                href={`/chatbots/${b.id}`}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="grid size-9 place-items-center rounded-full text-sm font-semibold text-white"
                    style={{ background: `linear-gradient(135deg, ${b.primaryColor}, #3b82f6)` }}
                  >
                    {initials(b.name)}
                  </span>
                  <div>
                    <p className="font-medium text-foreground">{b.name}</p>
                    <p className="text-xs text-muted-foreground">Chatbot</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{relativeTime(b.createdAt)}</span>
                  <Badge variant="outline" className="border-success/30 bg-success/10 text-success">
                    active
                  </Badge>
                </div>
              </Link>
            ))}
            {recent.length === 0 ? (
              <p className="py-3 text-sm text-muted-foreground">No agents yet.</p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
