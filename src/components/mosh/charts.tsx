"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/**
 * Chart primitives.
 *
 * The three series colours are read from CSS custom properties, so light and
 * dark are two *selected* palettes rather than an automatic flip, and the SVG
 * follows the viewer's theme with no JavaScript involved. Both sets were run
 * through the six computable checks (see globals.css for the recorded numbers).
 *
 * House rules applied throughout: one y-axis, never two; thin marks; recessive
 * grid; a legend whenever more than one series is present; a tooltip on every
 * chart; and values printed as text wherever the number itself is the point.
 */

const AXIS = { fontSize: 11 };
const GRID = "var(--mosh-chart-grid)";
const SERIES = ["var(--mosh-chart-1)", "var(--mosh-chart-2)", "var(--mosh-chart-3)"] as const;

type TooltipRow = { name?: string; value?: number | string; color?: string; dataKey?: string };

function ChartTooltip({
  active,
  payload,
  label,
  suffix = "",
  formatter,
}: {
  active?: boolean;
  payload?: TooltipRow[];
  label?: string | number;
  suffix?: string;
  formatter?: (value: number) => string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-xl border border-mosh-line bg-mosh-surface px-3 py-2 text-xs shadow-[var(--mosh-shadow)]">
      <p className="font-medium text-mosh-ink">{label}</p>
      <ul className="mt-1.5 space-y-1">
        {payload.map((row) => (
          <li key={`${row.dataKey}`} className="flex items-center gap-2 text-mosh-ink-muted">
            <span
              aria-hidden
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: row.color }}
            />
            <span>{row.name}</span>
            <span className="ml-auto font-medium tabular-nums text-mosh-ink">
              {typeof row.value === "number"
                ? formatter
                  ? formatter(row.value)
                  : `${row.value}${suffix}`
                : row.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const legendStyle = { fontSize: 11, color: "var(--mosh-chart-axis)" };

// ---------------------------------------------------------------------------

export type AlignmentPoint = { label: string; alignment: number; completion: number };

/** Daily alignment against the rhythm that produced it. */
export function AlignmentTrendChart({ data }: { data: AlignmentPoint[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
          <defs>
            <linearGradient id="mosh-alignment-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={SERIES[0]} stopOpacity={0.28} />
              <stop offset="100%" stopColor={SERIES[0]} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={GRID} strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey="label" tick={AXIS} axisLine={false} tickLine={false} minTickGap={16} />
          <YAxis domain={[0, 100]} tick={AXIS} axisLine={false} tickLine={false} width={44} />
          <Tooltip content={<ChartTooltip suffix="%" />} cursor={{ stroke: GRID }} />
          <Legend wrapperStyle={legendStyle} iconType="plainline" />
          <Area
            type="monotone"
            dataKey="alignment"
            name="Alignment"
            stroke={SERIES[0]}
            strokeWidth={2}
            fill="url(#mosh-alignment-fill)"
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Area
            type="monotone"
            dataKey="completion"
            name="Rhythm complete"
            stroke={SERIES[1]}
            strokeWidth={2}
            strokeDasharray="4 3"
            fill="none"
            dot={false}
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export type MomentumPoint = { label: string; value: number };

/** One series, one axis — used for weekly momentum and monthly growth. */
export function ScoreBarChart({
  data,
  name,
  height = 240,
}: {
  data: MomentumPoint[];
  name: string;
  height?: number;
}) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }} barCategoryGap="28%">
          <CartesianGrid stroke={GRID} strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey="label" tick={AXIS} axisLine={false} tickLine={false} minTickGap={12} />
          <YAxis domain={[0, 100]} tick={AXIS} axisLine={false} tickLine={false} width={44} />
          <Tooltip content={<ChartTooltip suffix="%" />} cursor={{ fill: "var(--mosh-surface-2)" }} />
          <Bar dataKey="value" name={name} fill={SERIES[0]} radius={[4, 4, 0, 0]} maxBarSize={38} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export type WealthPoint = {
  label: string;
  attraction: number;
  core: number;
  premium: number;
};

/**
 * Wealth Flow Index by tier, stacked.
 *
 * The bars show *weighted* contribution — the same multipliers the index uses —
 * so the height of a segment is the thing the formula actually rewards. A 2px
 * surface-coloured stroke keeps adjacent segments legible.
 */
export function WealthFlowChart({
  data,
  currency,
}: {
  data: WealthPoint[];
  currency: string;
}) {
  const format = (value: number) => `${currency} ${Math.round(value).toLocaleString()}`;

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 4 }} barCategoryGap="26%">
          <CartesianGrid stroke={GRID} strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey="label" tick={AXIS} axisLine={false} tickLine={false} minTickGap={12} />
          <YAxis tick={AXIS} axisLine={false} tickLine={false} width={64} />
          <Tooltip
            content={<ChartTooltip formatter={format} />}
            cursor={{ fill: "var(--mosh-surface-2)" }}
          />
          <Legend wrapperStyle={legendStyle} iconType="square" />
          <Bar
            dataKey="attraction"
            name="Attraction × 1"
            stackId="wealth"
            fill={SERIES[0]}
            stroke="var(--mosh-chart-surface)"
            strokeWidth={2}
            maxBarSize={44}
          />
          <Bar
            dataKey="core"
            name="Core × 2"
            stackId="wealth"
            fill={SERIES[1]}
            stroke="var(--mosh-chart-surface)"
            strokeWidth={2}
            maxBarSize={44}
          />
          <Bar
            dataKey="premium"
            name="Premium × 3"
            stackId="wealth"
            fill={SERIES[2]}
            stroke="var(--mosh-chart-surface)"
            strokeWidth={2}
            radius={[4, 4, 0, 0]}
            maxBarSize={44}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export type HorizontalPoint = { label: string; value: number; caption?: string };

/** Horizontal bars for habits and funnel stages — one series, labels included. */
export function HorizontalBarChart({
  data,
  name,
  suffix = "",
  height,
}: {
  data: HorizontalPoint[];
  name: string;
  suffix?: string;
  height?: number;
}) {
  const computed = height ?? Math.max(180, data.length * 42);

  return (
    <div style={{ height: computed }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 24, bottom: 4, left: 4 }}
          barCategoryGap="24%"
        >
          <CartesianGrid stroke={GRID} strokeDasharray="2 4" horizontal={false} />
          <XAxis type="number" tick={AXIS} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="label"
            tick={AXIS}
            axisLine={false}
            tickLine={false}
            width={128}
          />
          <Tooltip
            content={<ChartTooltip suffix={suffix} />}
            cursor={{ fill: "var(--mosh-surface-2)" }}
          />
          <Bar dataKey="value" name={name} fill={SERIES[0]} radius={[0, 4, 4, 0]} maxBarSize={26}>
            {data.map((entry) => (
              <Cell key={entry.label} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export type RadarPoint = { attribute: string; score: number };

/** One plane's attributes, scored 0-100. Single series, so no legend. */
export function PlaneRadarChart({ data }: { data: RadarPoint[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke={GRID} />
          <PolarAngleAxis dataKey="attribute" tick={{ fontSize: 10 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9 }} axisLine={false} />
          <Tooltip content={<ChartTooltip suffix="%" />} />
          <Radar
            name="Score"
            dataKey="score"
            stroke={SERIES[0]}
            strokeWidth={2}
            fill={SERIES[0]}
            fillOpacity={0.22}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
