import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { agents } from "@/lib/mock-data";
import { Plus, Filter, MoreHorizontal, Bot } from "lucide-react";

export const Route = createFileRoute("/agents")({
  head: () => ({
    meta: [
      { title: "Agents — Helm HQ" },
      { name: "description", content: "Every AI agent in your workspace, their performance, and status." },
    ],
  }),
  component: AgentsPage,
});

const statusStyles = {
  active: "border-success/30 bg-success/10 text-success",
  paused: "border-muted bg-muted text-muted-foreground",
  draft: "border-primary/30 bg-primary/10 text-primary",
} as const;

function AgentsPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8">
      <PageHeader
        eyebrow="Agents"
        title="All agents"
        description="Build, tune and ship AI agents. Each one can be embedded on any site in this workspace."
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Filter className="size-4" /> Filter
            </Button>
            <Button size="sm" className="gap-1.5">
              <Plus className="size-4" /> New agent
            </Button>
          </>
        }
      />

      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-12 border-b border-border px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <div className="col-span-4">Agent</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Model</div>
            <div className="col-span-1 text-right">Chats</div>
            <div className="col-span-2 text-right">Resolution</div>
            <div className="col-span-1 text-right">Updated</div>
          </div>
          <div className="divide-y divide-border">
            {agents.map((a) => (
              <div
                key={a.id}
                className="grid grid-cols-12 items-center px-5 py-4 transition hover:bg-muted/40"
              >
                <div className="col-span-4 flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-full bg-accent font-display text-sm font-semibold text-accent-foreground">
                    {a.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{a.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{a.role}</p>
                  </div>
                </div>
                <div className="col-span-2">
                  <Badge variant="outline" className={statusStyles[a.status]}>
                    {a.status}
                  </Badge>
                </div>
                <div className="col-span-2 font-mono text-xs text-muted-foreground">{a.model}</div>
                <div className="col-span-1 text-right tabular-nums">
                  {a.conversations.toLocaleString()}
                </div>
                <div className="col-span-2 text-right tabular-nums">
                  {a.resolution > 0 ? `${a.resolution}%` : "—"}
                </div>
                <div className="col-span-1 flex items-center justify-end gap-1 text-right text-xs text-muted-foreground">
                  <span>{a.updatedAt}</span>
                  <Button variant="ghost" size="icon" className="size-7">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
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
              Sales concierge, support triage, docs answerer, lead qualifier and 8 more — preconfigured tools and prompts.
            </p>
          </div>
          <Button size="sm">Browse templates</Button>
        </CardContent>
      </Card>
    </div>
  );
}
