import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { getBots } from '@/lib/db';
import { initials, relativeTime } from '@/lib/format';
import { Plus, MoreHorizontal, Bot } from 'lucide-react';

export const metadata = { title: 'Agents — CM Chatbots' };
export const dynamic = 'force-dynamic';

export default function AgentsPage() {
  const bots = getBots();

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8">
      <PageHeader
        eyebrow="Agents"
        title="All agents"
        description="Build, tune and ship AI agents. Each one can be embedded on any site in this workspace."
        actions={
          <Button asChild size="sm" className="gap-1.5">
            <Link href="/chatbots/new">
              <Plus className="size-4" /> New agent
            </Link>
          </Button>
        }
      />

      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-12 border-b border-border px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <div className="col-span-4">Agent</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Model</div>
            <div className="col-span-1 text-right">Chats</div>
            <div className="col-span-2 text-right">Leads</div>
            <div className="col-span-1 text-right">Updated</div>
          </div>
          {bots.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-muted-foreground">
              No agents yet.{' '}
              <Link href="/chatbots/new" className="text-primary hover:underline">
                Create your first agent
              </Link>
              .
            </div>
          ) : (
            <div className="divide-y divide-border">
              {bots.map((b) => (
                <Link
                  key={b.id}
                  href={`/chatbots/${b.id}`}
                  className="grid grid-cols-12 items-center px-5 py-4 transition hover:bg-muted/40"
                >
                  <div className="col-span-4 flex items-center gap-3">
                    <span
                      className="grid size-10 place-items-center rounded-full text-sm font-semibold text-white"
                      style={{ background: `linear-gradient(135deg, ${b.primaryColor}, #3b82f6)` }}
                    >
                      {initials(b.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{b.name}</p>
                      <p className="truncate text-xs text-muted-foreground">Chatbot</p>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Badge variant="outline" className="border-success/30 bg-success/10 text-success">
                      active
                    </Badge>
                  </div>
                  <div className="col-span-2 font-mono text-xs text-muted-foreground">gemini-2.0-flash</div>
                  <div className="col-span-1 text-right tabular-nums">
                    {(b.messageCount || 0).toLocaleString()}
                  </div>
                  <div className="col-span-2 text-right tabular-nums">
                    {(b.leadCount || 0).toLocaleString()}
                  </div>
                  <div className="col-span-1 flex items-center justify-end gap-1 text-right text-xs text-muted-foreground">
                    <span>{relativeTime(b.createdAt)}</span>
                    <MoreHorizontal className="size-4" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-dashed bg-accent/30">
        <CardContent className="flex flex-col items-center gap-3 p-8 text-center sm:flex-row sm:text-left">
          <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Bot className="size-5" />
          </div>
          <div className="flex-1">
            <p className="font-display text-base font-semibold text-foreground">
              Spin up an agent from a template
            </p>
            <p className="text-sm text-muted-foreground">
              Sales concierge, support triage, docs answerer, lead qualifier and more — preconfigured prompts.
            </p>
          </div>
          <Button asChild size="sm">
            <Link href="/chatbots/new">Create agent</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
