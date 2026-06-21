'use client';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export function AreaTrend({
  data,
  height = 288,
  idPrefix = 'trend',
}: {
  data: Array<{ day: string; conversations: number; resolved: number }>;
  height?: number;
  idPrefix?: string;
}) {
  const g1 = `${idPrefix}-g1`;
  const g2 = `${idPrefix}-g2`;
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={g1} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
              <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id={g2} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-chart-3)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--color-chart-3)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              background: 'var(--color-popover)',
              border: '1px solid var(--color-border)',
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Area type="monotone" dataKey="conversations" stroke="var(--color-chart-1)" strokeWidth={2} fill={`url(#${g1})`} />
          <Area type="monotone" dataKey="resolved" stroke="var(--color-chart-3)" strokeWidth={2} fill={`url(#${g2})`} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
