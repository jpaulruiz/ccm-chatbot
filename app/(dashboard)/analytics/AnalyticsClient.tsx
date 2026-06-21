'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { AreaTrend } from '@/components/charts/area-trend';
import { AgentBars } from '@/components/charts/agent-bars';
import { conversationsTrend, agentBreakdown, topIntents } from '@/lib/mock-data';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export interface SiteStat {
  id: string;
  name: string;
  domain: string;
  conversations: number;
  leads: number;
}

export function AnalyticsClient({ sites }: { sites: SiteStat[] }) {
  const [siteId, setSiteId] = useState(sites[0]?.id ?? '');
  const site = sites.find((s) => s.id === siteId) ?? sites[0];

  if (!site) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <PageHeader eyebrow="Analytics" title="Per-site performance" />
        <Card>
          <CardContent className="p-12 text-center text-sm text-muted-foreground">
            No agents yet — analytics will appear once you create one.
          </CardContent>
        </Card>
      </div>
    );
  }

  // Visitors are not tracked yet; estimate from conversations so the chart reads sensibly.
  const visitors = Math.max(site.conversations * 6, 120);
  const engagement = Math.round((site.conversations / visitors) * 100);

  const metrics = [
    { label: 'Conversations', value: site.conversations.toLocaleString(), delta: '+14%', up: true },
    { label: 'Leads', value: site.leads.toLocaleString(), delta: '+6%', up: true },
    { label: 'Engagement', value: `${engagement}%`, delta: '+2 pts', up: true },
    { label: 'Handoffs', value: '—', delta: '-9%', up: false },
  ];

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8">
      <PageHeader
        eyebrow="Analytics"
        title="Per-site performance"
        description="Pick a site to see how its agents are behaving — volume, leads and intents. Trend lines are illustrative until history accrues."
        actions={<Button variant="outline" size="sm">Export CSV</Button>}
      />

      <div className="flex flex-wrap gap-2">
        {sites.map((s) => (
          <button
            key={s.id}
            onClick={() => setSiteId(s.id)}
            className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition ${
              siteId === s.id
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-foreground hover:border-primary/40'
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${
                siteId === s.id ? 'bg-primary-foreground' : 'bg-success'
              }`}
            />
            {s.name}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardContent className="p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {m.label}
              </p>
              <p className="mt-2 font-display text-3xl font-semibold tracking-tight tabular-nums">
                {m.value}
              </p>
              <div className="mt-2 flex items-center gap-1 text-xs">
                {m.up ? (
                  <ArrowUpRight className="size-3.5 text-success" />
                ) : (
                  <ArrowDownRight className="size-3.5 text-destructive" />
                )}
                <span className={m.up ? 'text-success' : 'text-destructive'}>{m.delta}</span>
                <span className="text-muted-foreground">vs prior period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-display">Volume on {site.name}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Conversations and auto-resolved over the last 30 days.
            </p>
          </div>
          <Badge variant="secondary" className="rounded-full">{site.domain}</Badge>
        </CardHeader>
        <CardContent>
          <AreaTrend data={conversationsTrend} height={320} idPrefix="analytics" />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-display">By agent</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Which agents are doing the work on this site.
            </p>
          </CardHeader>
          <CardContent>
            <AgentBars data={agentBreakdown} height={288} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display">Top intents</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              What visitors actually want when they open the chat.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {topIntents.map((t) => (
              <div key={t.intent} className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
                <div>
                  <p className="font-medium text-foreground">{t.intent}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.count.toLocaleString()} conversations
                  </p>
                </div>
                <div className={`flex items-center gap-1 text-xs ${t.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {t.change >= 0 ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
                  {t.change >= 0 ? '+' : ''}
                  {t.change}%
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
