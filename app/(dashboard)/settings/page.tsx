import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { getBots } from '@/lib/db';

export const metadata = { title: 'Settings — CM Chatbots' };
export const dynamic = 'force-dynamic';

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2 border-b border-border py-5 last:border-b-0 sm:grid-cols-3 sm:gap-6">
      <div>
        <p className="font-medium text-foreground">{label}</p>
        {hint ? <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p> : null}
      </div>
      <div className="sm:col-span-2">{children}</div>
    </div>
  );
}

function Input({ defaultValue }: { defaultValue: string }) {
  return (
    <input
      defaultValue={defaultValue}
      className="h-10 w-full max-w-md rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
    />
  );
}

export default function SettingsPage() {
  const bots = getBots();
  const brandColor = bots[0]?.primaryColor ?? '#3b82f6';

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8">
      <PageHeader
        eyebrow="Settings"
        title="Workspace"
        description="Workspace identity, defaults and team. Per-agent settings live on each agent."
      />

      <Card>
        <CardHeader>
          <CardTitle className="font-display">General</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Row label="Workspace name" hint="Shown in the sidebar and notifications.">
            <Input defaultValue="Childcare Marketing" />
          </Row>
          <Row label="Default model" hint="New agents start with this model.">
            <Input defaultValue="gemini-2.0-flash" />
          </Row>
          <Row label="Brand color" hint="Used in widget headers and email handoffs.">
            <div className="flex items-center gap-3">
              <div
                className="size-10 rounded-lg border border-border"
                style={{ backgroundColor: brandColor }}
              />
              <Input defaultValue={brandColor} />
            </div>
          </Row>
          <Row label="Time zone" hint="Used in analytics and reports.">
            <Input defaultValue="Europe/London" />
          </Row>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display">Danger zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-start justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-center">
            <div>
              <p className="font-medium text-foreground">Delete workspace</p>
              <p className="text-sm text-muted-foreground">
                Removes all agents, sites, conversations and analytics. Cannot be undone.
              </p>
            </div>
            <Button variant="destructive" size="sm">Delete workspace</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
