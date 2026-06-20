import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/page-header";
import { agents, sites, conversationsTrend, topIntents } from "@/lib/mock-data";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Bot,
  Globe,
  MessageSquare,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview — Helm HQ" },
      { name: "description", content: "Live snapshot of every chatbot across every site." },
    ],
  }),
  component: Overview,
});

function Stat({
  label,
  value,
  delta,
  icon: Icon,
  positive = true,
}: {
  label: string;
  value: string;
  delta: string;
  icon: React.ElementType;
  positive?: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
            <p className="mt-2 font-display text-3xl font-semibold tracking-tight">{value}</p>
          </div>
          <div className="grid size-9 place-items-center rounded-md bg-accent text-accent-foreground">
            <Icon className="size-4" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1 text-xs">
          {positive ? (
            <ArrowUpRight className="size-3.5 text-success" />
          ) : (
            <ArrowDownRight className="size-3.5 text-destructive" />
          )}
          <span className={positive ? "text-success" : "text-destructive"}>{delta}</span>
          <span className="text-muted-foreground">vs last 30d</span>
        </div>
      </CardContent>
    </Card>
  );
}

function Overview() {
  const totalConversations = agents.reduce((s, a) => s + a.conversations, 0);
  const activeAgents = agents.filter((a) => a.status === "active").length;
  const liveSites = sites.filter((s) => s.status === "live").length;
  const avgResolution = Math.round(
    agents.filter((a) => a.conversations > 0).reduce((s, a) => s + a.resolution, 0) /
      agents.filter((a) => a.conversations > 0).length,
  );

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8">
      <PageHeader
        eyebrow="Workspace · Acme"
        title="Good morning, Mira"
        description="Six agents are answering across five sites. Nothing's on fire — but Pier Studio's embed is flaky."
        actions={
          <>
            <Button variant="outline" size="sm">
              View changelog
            </Button>
            <Button size="sm" className="gap-1.5">
              <Sparkles className="size-4" /> Draft a new agent
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Conversations" value={totalConversations.toLocaleString()} delta="+18%" icon={MessageSquare} />
        <Stat label="Active agents" value={`${activeAgents}`} delta="+1" icon={Bot} />
        <Stat label="Live sites" value={`${liveSites}`} delta="+0" icon={Globe} positive />
        <Stat label="Avg. resolution" value={`${avgResolution}%`} delta="+4 pts" icon={Activity} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-display">Conversations · last 30 days</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Total volume vs auto-resolved by your agents.
              </p>
            </div>
            <Badge variant="secondary" className="rounded-full">Live</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={conversationsTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="convoGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="resolvedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-chart-3)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-chart-3)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-popover)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Area type="monotone" dataKey="conversations" stroke="var(--color-chart-1)" strokeWidth={2} fill="url(#convoGrad)" />
                  <Area type="monotone" dataKey="resolved" stroke="var(--color-chart-3)" strokeWidth={2} fill="url(#resolvedGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
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
                <div className="flex items-center gap-1 text-xs">
                  {t.change >= 0 ? (
                    <ArrowUpRight className="size-3 text-success" />
                  ) : (
                    <ArrowDownRight className="size-3 text-destructive" />
                  )}
                  <span className={t.change >= 0 ? "text-success" : "text-destructive"}>
                    {t.change >= 0 ? "+" : ""}
                    {t.change}%
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display">Sites needing attention</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/sites">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            {sites.slice(0, 4).map((s) => (
              <div key={s.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">{s.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{s.domain}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm tabular-nums text-muted-foreground">
                    {s.conversations30d.toLocaleString()} chats
                  </span>
                  <Badge
                    variant="outline"
                    className={
                      s.embedHealth === "healthy"
                        ? "border-success/30 bg-success/10 text-success"
                        : s.embedHealth === "warning"
                          ? "border-warning/40 bg-warning/15 text-warning-foreground"
                          : "border-destructive/30 bg-destructive/10 text-destructive"
                    }
                  >
                    {s.embedHealth}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display">Recently updated agents</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/agents">Open agents</Link>
            </Button>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            {agents.slice(0, 4).map((a) => (
              <div key={a.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="grid size-9 place-items-center rounded-full bg-accent font-display text-sm font-semibold text-accent-foreground">
                    {a.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{a.name}</p>
                    <p className="text-xs text-muted-foreground">{a.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{a.updatedAt}</span>
                  <Badge
                    variant="outline"
                    className={
                      a.status === "active"
                        ? "border-success/30 bg-success/10 text-success"
                        : a.status === "paused"
                          ? "border-muted bg-muted text-muted-foreground"
                          : "border-primary/30 bg-primary/10 text-primary"
                    }
                  >
                    {a.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
