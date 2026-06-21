'use client';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export function AgentBars({
  data,
  height = 288,
}: {
  data: Array<{ name: string; conversations: number }>;
  height?: number;
}) {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              background: 'var(--color-popover)',
              border: '1px solid var(--color-border)',
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Bar dataKey="conversations" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
