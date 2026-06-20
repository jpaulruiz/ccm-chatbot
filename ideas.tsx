import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { ideas as seedIdeas, type Idea } from "@/lib/mock-data";
import { Plus, ChevronUp, Lightbulb, Send } from "lucide-react";

export const Route = createFileRoute("/ideas")({
  head: () => ({
    meta: [
      { title: "Ideas — Helm HQ" },
      { name: "description", content: "Capture, rank and ship ideas that improve your chatbots." },
    ],
  }),
  component: IdeasPage,
});

const categoryColors: Record<Idea["category"], string> = {
  feature: "border-primary/30 bg-primary/10 text-primary",
  agent: "border-chart-5/30 bg-chart-5/10 text-chart-5",
  integration: "border-chart-2/30 bg-chart-2/10 text-chart-2",
  workflow: "border-chart-4/40 bg-chart-4/15 text-warning-foreground",
};

const statusColors: Record<Idea["status"], string> = {
  new: "border-border bg-muted text-muted-foreground",
  exploring: "border-primary/30 bg-primary/10 text-primary",
  "in-progress": "border-warning/40 bg-warning/15 text-warning-foreground",
  shipped: "border-success/30 bg-success/10 text-success",
};

function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>(seedIdeas);
  const [draft, setDraft] = useState("");
  const [filter, setFilter] = useState<"all" | Idea["status"]>("all");

  const filtered = ideas
    .filter((i) => (filter === "all" ? true : i.status === filter))
    .sort((a, b) => b.votes - a.votes);

  const submit = () => {
    if (!draft.trim()) return;
    setIdeas((cur) => [
      {
        id: `id_${Math.random().toString(36).slice(2, 7)}`,
        title: draft.trim(),
        description: "Added from the HQ idea board.",
        category: "feature",
        votes: 1,
        status: "new",
        author: "You",
      },
      ...cur,
    ]);
    setDraft("");
  };

  const vote = (id: string) =>
    setIdeas((cur) => cur.map((i) => (i.id === id ? { ...i, votes: i.votes + 1 } : i)));

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <PageHeader
        eyebrow="Ideas"
        title="What should we build next?"
        description="Drop ideas from customer chats, team retros, or your own brain. Vote, sort, ship."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5">
            <Lightbulb className="size-4" /> Idea sources
          </Button>
        }
      />

      <Card className="border-dashed">
        <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
          <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Plus className="size-5" />
          </div>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="A new agent skill, a missing integration, a tiny workflow fix…"
            className="h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
          <Button onClick={submit} className="gap-1.5">
            <Send className="size-4" /> Add idea
          </Button>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        {(["all", "new", "exploring", "in-progress", "shipped"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition ${
              filter === s
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {s.replace("-", " ")}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((idea) => (
          <Card key={idea.id} className="flex flex-col transition hover:border-primary/40 hover:shadow-sm">
            <CardContent className="flex flex-1 gap-4 p-5">
              <button
                onClick={() => vote(idea.id)}
                className="flex h-fit flex-col items-center gap-0.5 rounded-lg border border-border bg-card px-2.5 py-2 transition hover:border-primary hover:bg-primary/5 hover:text-primary"
              >
                <ChevronUp className="size-4" />
                <span className="font-display text-sm font-semibold tabular-nums">{idea.votes}</span>
              </button>
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className={categoryColors[idea.category]}>
                    {idea.category}
                  </Badge>
                  <Badge variant="outline" className={statusColors[idea.status]}>
                    {idea.status.replace("-", " ")}
                  </Badge>
                </div>
                <h3 className="font-display text-base font-semibold tracking-tight text-foreground">
                  {idea.title}
                </h3>
                <p className="text-sm text-muted-foreground">{idea.description}</p>
                <p className="mt-auto text-xs text-muted-foreground">By {idea.author}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
