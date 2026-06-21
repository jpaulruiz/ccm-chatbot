'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Bot,
  Globe,
  BarChart3,
  MessageSquare,
  Users,
  Lightbulb,
  Plug,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const groups: { label: string; items: { href: string; label: string; icon: React.ElementType }[] }[] = [
  {
    label: 'Workspace',
    items: [
      { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
      { href: '/agents', label: 'Agents', icon: Bot },
      { href: '/sites', label: 'Sites', icon: Globe },
      { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Operate',
    items: [
      { href: '/chatbots', label: 'Chatbots', icon: MessageSquare },
      { href: '/leads', label: 'Leads', icon: Users },
      { href: '/ideas', label: 'Ideas', icon: Lightbulb },
    ],
  },
  {
    label: 'Configure',
    items: [
      { href: '/integrations', label: 'Integrations', icon: Plug },
      { href: '/settings', label: 'Settings', icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const path = usePathname();
  return (
    <aside className="flex w-56 shrink-0 flex-col gap-6 border-r border-border bg-card px-3 py-4">
      <div className="flex items-center gap-2 px-2">
        <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-[#2d9d6f] to-[#3b82f6] text-sm font-bold text-white">
          C
        </span>
        <span className="font-display text-sm font-bold">CM Chatbots</span>
      </div>
      <nav className="flex flex-col gap-5">
        {groups.map((group) => (
          <div key={group.label} className="flex flex-col gap-1">
            <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {group.label}
            </p>
            {group.items.map((item) => {
              const active =
                path === item.href || (item.href !== '/dashboard' && path.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors',
                    active
                      ? 'bg-accent font-medium text-foreground'
                      : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
