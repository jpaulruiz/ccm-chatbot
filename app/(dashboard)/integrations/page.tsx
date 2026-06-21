import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { MessageSquare, Webhook, CreditCard, Database, GitBranch, Mail } from 'lucide-react';

export const metadata = { title: 'Integrations — CM Chatbots' };

const items = [
  { name: 'Slack', desc: 'Hand off unresolved chats and ping channels.', icon: MessageSquare, connected: true },
  { name: 'Webhooks', desc: 'Stream every conversation event to your stack.', icon: Webhook, connected: true },
  { name: 'Stripe', desc: 'Let billing agents read subscription state.', icon: CreditCard, connected: false },
  { name: 'Postgres', desc: 'Give docs agents read-only DB lookups.', icon: Database, connected: false },
  { name: 'GitHub', desc: 'File issues from chats with one tap.', icon: GitBranch, connected: true },
  { name: 'Resend', desc: "Send follow-ups when no one's online.", icon: Mail, connected: false },
];

export default function IntegrationsPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <PageHeader
        eyebrow="Integrations"
        title="Tools for your agents"
        description="Connect the systems your agents need to actually be useful — CRMs, payments, docs, comms."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <Card key={it.name} className="transition hover:border-primary/40 hover:shadow-sm">
              <CardContent className="flex flex-col gap-4 p-5">
                <div className="flex items-start justify-between">
                  <div className="grid size-10 place-items-center rounded-lg bg-accent text-accent-foreground">
                    <Icon className="size-5" />
                  </div>
                  {it.connected ? (
                    <Badge variant="outline" className="border-success/30 bg-success/10 text-success">
                      connected
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      available
                    </Badge>
                  )}
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-foreground">{it.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{it.desc}</p>
                </div>
                <Button variant={it.connected ? 'outline' : 'default'} size="sm" className="w-full">
                  {it.connected ? 'Manage' : 'Connect'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
