"use client";

import { Bar, BarChart, XAxis } from "recharts";
import { CalendarBlank, Export, CaretRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

/* -------------------------------------------------------------------------- */
/*  Chart configs                                                             */
/* -------------------------------------------------------------------------- */

const mainChartConfig = {
  requests: { label: "Requests", color: "var(--chart-1)" },
} satisfies ChartConfig;

const endpointChartConfig = {
  value: { label: "Requests", color: "var(--chart-1)" },
} satisfies ChartConfig;

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

const TOTAL_REQUESTS = "5,028";

const MAIN_CHART_DATA = [
  { date: "Jan 14", requests: 340 },
  { date: "Jan 15", requests: 200 },
  { date: "Jan 16", requests: 340 },
  { date: "Jan 17", requests: 340 },
  { date: "Jan 18", requests: 100 },
  { date: "Jan 19", requests: 100 },
  { date: "Jan 20", requests: 100 },
  { date: "Jan 21", requests: 200 },
  { date: "Jan 22", requests: 340 },
  { date: "Jan 23", requests: 500 },
  { date: "Jan 24", requests: 100 },
  { date: "Jan 25", requests: 10 },
  { date: "Jan 26", requests: 10 },
  { date: "Jan 28", requests: 340 },
  { date: "Jan 29", requests: 402 },
];

const LOGS = [
  { date: "Jan 29, 2026", endpoint: "Create from topic", credit: "120" },
  { date: "Feb 05, 2026", endpoint: "Create from topic", credit: "3,145" },
  { date: "Feb 12, 2026", endpoint: "Create from topic", credit: "1,800" },
  { date: "Feb 19, 2026", endpoint: "Create single slide", credit: "2,500" },
  { date: "Feb 26, 2026", endpoint: "Create from topic", credit: "4,200" },
  { date: "Mar 05, 2026", endpoint: "Create from file", credit: "3,600" },
  { date: "Mar 12, 2026", endpoint: "Create single slide", credit: "2,900" },
  { date: "Mar 19, 2026", endpoint: "Create from file", credit: "5,000" },
  { date: "Mar 26, 2026", endpoint: "Create single slide", credit: "4,700" },
  { date: "Apr 02, 2026", endpoint: "Create from topic", credit: "6,800" },
];

const ENDPOINT_CHARTS = [
  {
    name: "Create from topic",
    requests: "372 request",
    data: [
      { d: "1", value: 200 }, { d: "2", value: 300 }, { d: "3", value: 200 },
      { d: "4", value: 200 }, { d: "5", value: 10 }, { d: "6", value: 200 },
      { d: "7", value: 400 }, { d: "8", value: 300 }, { d: "9", value: 400 },
      { d: "10", value: 500 }, { d: "11", value: 200 }, { d: "12", value: 10 },
      { d: "13", value: 10 }, { d: "14", value: 400 },
    ],
  },
  {
    name: "Create single slide",
    requests: "788 request",
    data: [
      { d: "1", value: 400 }, { d: "2", value: 300 }, { d: "3", value: 10 },
      { d: "4", value: 10 }, { d: "5", value: 200 }, { d: "6", value: 200 },
      { d: "7", value: 200 }, { d: "8", value: 10 }, { d: "9", value: 400 },
      { d: "10", value: 500 }, { d: "11", value: 200 }, { d: "12", value: 10 },
      { d: "13", value: 10 }, { d: "14", value: 400 },
    ],
  },
  {
    name: "Create from file",
    requests: "508 request",
    data: [
      { d: "1", value: 400 }, { d: "2", value: 300 }, { d: "3", value: 200 },
      { d: "4", value: 400 }, { d: "5", value: 200 }, { d: "6", value: 10 },
      { d: "7", value: 10 }, { d: "8", value: 300 }, { d: "9", value: 200 },
      { d: "10", value: 500 }, { d: "11", value: 200 }, { d: "12", value: 10 },
      { d: "13", value: 10 }, { d: "14", value: 400 },
    ],
  },
];

const API_KEY_USAGE = [
  { key: "key_Abc123Xyz456", credits: "2,920" },
  { key: "key_Qwe789Rty123", credits: "599" },
  { key: "key_Lmn456Pqr789", credits: "289" },
];

const PAGES = [1, 2, 3, 4, 5, 6];

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function UsagePage() {
  return (
    <main className="flex flex-1 flex-col overflow-hidden rounded-xl bg-bg-primary shadow-elevation-3">
      {/* Header */}
      <div className="flex h-[63px] items-center justify-between border-b border-border-secondary px-6">
        <h1 className="text-[length:var(--text-2xl)] leading-[var(--leading-heading)] tracking-tight text-text-primary">
          Usage &amp; logs
        </h1>
        <div className="flex items-center overflow-hidden rounded-lg bg-bg-elevated shadow-elevation-2">
          <Button variant="ghost" size="md" className="rounded-none">
            <CalendarBlank weight="regular" className="size-4" />
            01/14/26 - 01/29/26
          </Button>
          <div className="h-9 w-px bg-border-tertiary" />
          <Button variant="ghost" size="md" className="rounded-none">
            <Export weight="regular" className="size-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Two-column content */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Left: Chart + Logs ─────────────────────────────────── */}
        <div className="flex w-[768px] shrink-0 flex-col overflow-y-auto">
          {/* Bar chart */}
          <div className="flex flex-col gap-5 border-b border-border-secondary px-6 pb-10 pt-6">
            <div className="flex flex-col gap-1">
              <span className="text-[length:var(--text-base)] text-text-secondary">Total request</span>
              <span className="text-[length:var(--text-lg)] font-medium text-text-primary">
                {TOTAL_REQUESTS}
              </span>
            </div>
            <ChartContainer config={mainChartConfig} className="h-[240px] w-full [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-bg-brand-selected">
              <BarChart data={MAIN_CHART_DATA} barCategoryGap="20%">
                <defs>
                  <linearGradient id="cursorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--bg-brand-selected)" stopOpacity={0} />
                    <stop offset="100%" stopColor="var(--bg-brand-selected)" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                  tick={{ fontSize: 10 }}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={{ fill: "url(#cursorGradient)" }}
                />
                <Bar
                  dataKey="requests"
                  fill="var(--color-requests)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </div>

          {/* Logs section */}
          <div className="flex flex-col">
            {/* Logs header */}
            <div className="border-b border-border-secondary px-6 pb-4 pt-8">
              <h2 className="text-[length:var(--text-md)] font-medium text-text-primary">Logs</h2>
            </div>

            {/* Table header */}
            <div className="flex border-b border-border-secondary">
              <div className="w-[200px] shrink-0 px-6 pb-3 pt-4">
                <span className="text-[length:var(--text-base)] font-medium text-text-primary">Date</span>
              </div>
              <div className="flex-1 px-6 pb-3 pt-4">
                <span className="text-[length:var(--text-base)] font-medium text-text-primary">End points</span>
              </div>
              <div className="w-[185px] shrink-0 px-6 pb-3 pt-4 text-right">
                <span className="text-[length:var(--text-base)] font-medium text-text-primary">Credit</span>
              </div>
            </div>

            {/* Table rows */}
            {LOGS.map((log, i) => (
              <div key={i} className="flex border-b border-border-secondary">
                <div className="w-[200px] shrink-0 px-6 py-4">
                  <span className="text-[length:var(--text-base)] text-text-primary">{log.date}</span>
                </div>
                <div className="flex-1 px-6 py-4">
                  <span className="text-[length:var(--text-base)] text-text-primary">{log.endpoint}</span>
                </div>
                <div className="w-[185px] shrink-0 px-6 py-4 text-right">
                  <span className="text-[length:var(--text-base)] text-text-primary">{log.credit}</span>
                </div>
              </div>
            ))}

            {/* Pagination */}
            <div className="flex items-center px-6 py-4">
              <div className="flex items-center overflow-hidden rounded-lg bg-bg-elevated shadow-elevation-2">
                {PAGES.map((page, i) => (
                  <div key={page} className="flex items-center">
                    {i > 0 && <div className="h-9 w-px bg-border-tertiary" />}
                    <button
                      className={cn(
                        "flex h-9 min-w-9 items-center justify-center px-3.5 text-[length:var(--text-base)] font-medium text-text-primary",
                        page === 1 && "bg-bg-elevated-hover"
                      )}
                    >
                      {page}
                    </button>
                  </div>
                ))}
                <div className="h-9 w-px bg-border-tertiary" />
                <button className="flex size-9 items-center justify-center text-text-primary">
                  <CaretRight weight="regular" className="size-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Endpoints + API Keys ────────────────────────── */}
        <div className="flex flex-1 flex-col overflow-y-auto border-l border-border-tertiary">
          {/* API Endpoints header */}
          <div className="border-b border-border-secondary px-6 pb-4 pt-8">
            <h2 className="text-[length:var(--text-md)] font-medium text-text-primary">
              API Endpoints
            </h2>
          </div>

          {/* Endpoint charts */}
          {ENDPOINT_CHARTS.map((ep, i) => (
            <div
              key={ep.name}
              className={cn(
                "flex flex-1 flex-col gap-5 border-b p-5",
                i < ENDPOINT_CHARTS.length - 1
                  ? "border-border-secondary"
                  : "border-border-tertiary"
              )}
            >
              <div className="flex flex-col gap-1">
                <span className="text-[length:var(--text-base)] font-medium text-text-primary">
                  {ep.name}
                </span>
                <span className="text-[length:var(--text-base)] text-text-secondary">
                  {ep.requests}
                </span>
              </div>
              <ChartContainer config={endpointChartConfig} className="h-full w-full">
                <BarChart data={ep.data} barCategoryGap="15%">
                  <Bar
                    dataKey="value"
                    fill="var(--color-value)"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          ))}

          {/* API Keys header */}
          <div className="border-b border-border-secondary px-6 pb-4 pt-8">
            <h2 className="text-[length:var(--text-md)] font-medium text-text-primary">
              API Keys
            </h2>
          </div>

          {/* API Key rows */}
          <div className="flex flex-col px-5 pt-2">
            {API_KEY_USAGE.map((item, i) => (
              <div
                key={item.key}
                className={cn(
                  "flex items-center justify-between py-4",
                  i < API_KEY_USAGE.length - 1 &&
                    "border-b border-border-secondary"
                )}
              >
                <span className="text-[length:var(--text-base)] text-text-secondary">{item.key}</span>
                <span className="text-[length:var(--text-base)] font-medium text-text-primary">
                  {item.credits}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
