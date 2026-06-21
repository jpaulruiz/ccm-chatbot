import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { getBots, getLeads } from '@/lib/db';
import { slugDomain } from '@/lib/format';
import { Plus, Globe, ExternalLink, ArrowRight } from 'lucide-react';

export const metadata = { title: 'Sites — CM Chatbots' };
export const dynamic = 'force-dynamic';

export default function SitesPage() {
  const bots = getBots();
  const leads = getLeads();

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8">
      <PageHeader
        eyebrow="Sites"
        title="Connected sites"
        description="Add the embed to any site, then assign which agents respond there. Each agent is shown with its live deployment."
        actions={
          <Button asChild size="sm" className="gap-1.5">
            <Link href="/chatbots/new">
              <Plus className="size-4" /> Add site
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {bots.map((b) => {
          const domain = slugDomain(b.name);
          const botLeads = leads.filter((l) => l.botId === b.id).length;
          return (
            <Card key={b.id} className="group flex flex-col overflow-hidden transition hover:border-primary/40 hover:shadow-sm">
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="grid size-10 place-items-center rounded-lg bg-accent text-accent-foreground">
                    <Globe className="size-5" />
                  </div>
                  <Badge variant="outline" className="border-success/30 bg-success/10 text-success">
                    healthy
                  </Badge>
                </div>
                <div>
                  <CardTitle className="font-display text-lg">{b.name}</CardTitle>
                  <span className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                    {domain} <ExternalLink className="size-3" />
                  </span>
                </div>
              </CardHeader>
              <CardContent className="mt-auto space-y-4">
                <div className="grid grid-cols-3 gap-2 rounded-lg border border-border bg-muted/40 p-3 text-center">
                  <div>
                    <p className="font-display text-lg font-semibold tabular-nums">1</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Agents</p>
                  </div>
                  <div>
                    <p className="font-display text-lg font-semibold tabular-nums">{b.messageCount || 0}</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Chats</p>
                  </div>
                  <div>
                    <p className="font-display text-lg font-semibold tabular-nums">{botLeads}</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Leads</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Primary · <span className="font-medium text-foreground">{b.name}</span>
                  </div>
                  <Button asChild variant="ghost" size="sm" className="gap-1">
                    <Link href="/analytics">
                      Analytics <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        <Card className="flex flex-col items-center justify-center gap-3 border-dashed bg-accent/20 p-8 text-center">
          <div className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
            <Plus className="size-5" />
          </div>
          <div>
            <p className="font-display font-semibold text-foreground">Add a new site</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Paste a domain, drop in a snippet, assign an agent.
            </p>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link href="/chatbots/new">Get started</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
