"use client";

import {
  Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from "recharts";

/**
 * Chart primitives.
 *
 * The categorical palette is the three-slot set validated for both light and
 * dark surfaces (blue / orange / aqua). Aqua sits just under 3:1 on a white
 * surface, so every chart that uses it ships the accompanying data table — the
 * relief rule — and a legend, so identity is never carried by colour alone.
 */

const SERIES = {
  light: ["#2a78d6", "#eb6834", "#1baf7a"],
  dark: ["#3987e5", "#d95926", "#199e70"],
} as const;

/** Single-hue ordinal step that clears 2:1 on both surfaces. */
const ORDINAL = { light: "#2a78d6", dark: "#3987e5" } as const;

function usePalette() {
  // Recharts renders on the client; reading the media query directly keeps the
  // series colours in step with the viewer's theme without a context provider.
  const dark =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  return {
    series: dark ? SERIES.dark : SERIES.light,
    ordinal: dark ? ORDINAL.dark : ORDINAL.light,
    grid: dark ? "#253040" : "#e2e5ea",
    text: dark ? "#a3aebe" : "#4b5563",
    surface: dark ? "#121820" : "#ffffff",
  };
}

const AXIS_STYLE = { fontSize: 11 };

export type MoneySeriesPoint = { month: string; revenue: number; expenses: number; profit: number };

export function MoneySeriesChart({
  data,
  currency,
}: {
  data: MoneySeriesPoint[];
  currency: string;
}) {
  const palette = usePalette();
  const format = (value: number) => `${currency} ${Math.round(value).toLocaleString()}`;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }} barGap={2}>
          <CartesianGrid stroke={palette.grid} strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey="month" tick={{ ...AXIS_STYLE, fill: palette.text }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ ...AXIS_STYLE, fill: palette.text }}
            axisLine={false}
            tickLine={false}
            width={64}
            tickFormatter={(value: number) => Math.round(value).toLocaleString()}
          />
          <Tooltip
            formatter={(value, name) => [format(Number(value ?? 0)), String(name ?? "")]}
            contentStyle={{
              background: palette.surface,
              border: `1px solid ${palette.grid}`,
              borderRadius: 8,
              fontSize: 12,
            }}
            cursor={{ fill: palette.grid, opacity: 0.35 }}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: palette.text }} />
          <Bar dataKey="revenue" name="Revenue" fill={palette.series[0]} radius={[4, 4, 0, 0]} />
          <Bar dataKey="expenses" name="Expenses" fill={palette.series[1]} radius={[4, 4, 0, 0]} />
          <Bar dataKey="profit" name="Profit" fill={palette.series[2]} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export type CategoryPoint = { label: string; value: number };

/**
 * Single-series horizontal bar. Used for pipeline stages and AI cost by agent —
 * one measure across named categories, so one hue and direct value labels.
 */
export function CategoryBarChart({
  data,
  valueFormatter,
  height = 240,
}: {
  data: CategoryPoint[];
  valueFormatter?: (value: number) => string;
  height?: number;
}) {
  const palette = usePalette();
  const format = valueFormatter ?? ((value: number) => value.toLocaleString());

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 40, bottom: 4, left: 8 }} barCategoryGap={4}>
          <CartesianGrid stroke={palette.grid} strokeDasharray="2 4" horizontal={false} />
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="label"
            tick={{ ...AXIS_STYLE, fill: palette.text }}
            axisLine={false}
            tickLine={false}
            width={120}
          />
          <Tooltip
            formatter={(value) => [format(Number(value ?? 0)), "Value"]}
            contentStyle={{
              background: palette.surface,
              border: `1px solid ${palette.grid}`,
              borderRadius: 8,
              fontSize: 12,
            }}
            cursor={{ fill: palette.grid, opacity: 0.35 }}
          />
          <Bar dataKey="value" fill={palette.ordinal} radius={[0, 4, 4, 0]}>
            {data.map((entry) => (
              <Cell key={entry.label} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
