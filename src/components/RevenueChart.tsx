"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface RevenueDataPoint {
  date: string;
  amount: number;
}

interface TooltipPayload {
  value?: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border bg-card px-3 py-2 text-sm shadow-md">
      <p className="font-medium text-card-foreground">{label}</p>
      <p className="text-primary">{payload[0].value?.toLocaleString()} XLM</p>
    </div>
  );
}

const MOCK_DATA: RevenueDataPoint[] = [
  { date: "Jan", amount: 420 },
  { date: "Feb", amount: 780 },
  { date: "Mar", amount: 560 },
  { date: "Apr", amount: 1200 },
  { date: "May", amount: 940 },
  { date: "Jun", amount: 1540 },
];

interface RevenueChartProps {
  data?: RevenueDataPoint[];
}

export default function RevenueChart({ data = MOCK_DATA }: RevenueChartProps) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-card-foreground">Revenue Over Time</h2>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.25} />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="date"
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={48}
          />
          <Tooltip content={(props) => <CustomTooltip active={props.active} payload={props.payload} label={String(props.label ?? "")} />} />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="var(--primary)"
            strokeWidth={2}
            fill="url(#revenueGradient)"
            dot={false}
            activeDot={{ r: 4, fill: "var(--primary)" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
