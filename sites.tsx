import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { sites } from "@/lib/mock-data";
import { Plus, Globe, ExternalLink, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/sites")({
  head: () => ({
    meta: [
      { title: "Sites — Helm HQ" },
      { name: "description", content: "Every site your agents are embedded on." },
    ],
  }),
  component: SitesPage,
});

const healthStyles = {
  healthy: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/40 bg-warning/15 text-warning-foreground",
  down: "border-destructive/30 bg-destructive/10 text-destructive",
} as const;

function SitesPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8">
      <PageHeader
        eyebrow="Sites"
        title="Connected sites"
        description="Add the Helm HQ embed to any site, then assign which agents respond there."
        actions={
          <Button size="sm" className="gap-1.5">
            <Plus className="size-4" /> Add site
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sites.map((s) => (
          <Card key={s.id} className="group flex flex-col overflow-hidden transition hover:border-primary/40 hover:shadow-sm">
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="grid size-10 place-items-center rounded-lg bg-accent text-accent-foreground">
                  <Globe className="size-5" />
                </div>
                <Badge variant="outline" className={healthStyles[s.embedHealth]}>
                  {s.embedHealth}
                </Badge>
              </div>
              <div>
                <CardTitle className="font-display text-lg">{s.name}</CardTitle>
                <a
                  href={`https://${s.domain}`}
                  className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground transition hover:text-foreground"
                >
                  {s.domain} <ExternalLink className="size-3" />
                </a>
              </div>
            </CardHeader>
            <CardContent className="mt-auto space-y-4">
              <div className="grid grid-cols-3 gap-2 rounded-lg border border-border bg-muted/40 p-3 text-center">
                <div>
                  <p className="font-display text-lg font-semibold tabular-nums">{s.agents}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Agents</p>
                </div>
                <div>
                  <p className="font-display text-lg font-semibold tabular-nums">
                    {(s.conversations30d / 1000).toFixed(1)}k
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Chats</p>
                </div>
                <div>
                  <p className="font-display text-lg font-semibold tabular-nums">
                    {(s.visitors30d / 1000).toFixed(0)}k
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Visitors</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  Primary · <span className="font-medium text-foreground">{s.primaryAgent}</span>
                </div>
                <Button asChild variant="ghost" size="sm" className="gap-1">
                  <Link to="/analytics">
                    Analytics <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

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
          <Button size="sm" variant="outline">
            Get started
          </Button>
        </Card>
      </div>
    </div>
  );
}
