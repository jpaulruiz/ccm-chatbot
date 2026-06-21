'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Bell, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const labels: Record<string, string> = {
  '/dashboard': 'Overview',
  '/agents': 'Agents',
  '/sites': 'Sites',
  '/analytics': 'Analytics',
  '/chatbots': 'Chatbots',
  '/leads': 'Leads',
  '/ideas': 'Ideas',
  '/integrations': 'Integrations',
  '/settings': 'Settings',
};

export function TopBar() {
  const pathname = usePathname();
  const base = '/' + (pathname.split('/').filter(Boolean)[0] ?? '');
  const label = labels[pathname] ?? labels[base] ?? 'Workspace';

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">CM Chatbots</span>
        <span className="text-muted-foreground/50">/</span>
        <span className="font-medium text-foreground">{label}</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search agents, sites, conversations…"
            className="h-9 w-72 rounded-md border border-input bg-card pl-8 pr-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
        </div>
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="size-4" />
        </Button>
        <Button asChild size="sm">
          <Link href="/chatbots/new">
            <Plus className="size-4" />
            New chatbot
          </Link>
        </Button>
      </div>
    </header>
  );
}
