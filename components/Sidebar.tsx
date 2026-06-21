'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/dashboard', label: 'Overview', icon: '▦' },
  { href: '/chatbots', label: 'Chatbots', icon: '◈' },
  { href: '/leads', label: 'Leads', icon: '◎' },
];

export default function Sidebar() {
  const path = usePathname();

  return (
    <aside className="w-48 bg-[#0c1220] border-r border-[#1f2940] flex flex-col gap-1 p-3 min-h-screen">
      <div className="flex items-center gap-2 px-2 pb-4 pt-1">
        <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#2d9d6f] to-[#3b82f6] grid place-items-center text-sm font-bold">C</span>
        <span className="font-bold text-sm">CM Chatbots</span>
      </div>
      {links.map((l) => {
        const active = path === l.href || (l.href !== '/dashboard' && path.startsWith(l.href));
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              active
                ? 'bg-gradient-to-r from-[#2d9d6f22] to-[#3b82f611] border border-[#1f2940] text-white'
                : 'text-[#9aa7bd] hover:text-white hover:bg-[#111726]'
            }`}
          >
            <span className="text-xs">{l.icon}</span>
            {l.label}
          </Link>
        );
      })}
    </aside>
  );
}
