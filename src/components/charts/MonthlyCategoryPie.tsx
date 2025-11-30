"use client";

import * as React from "react";
import { Pie, PieChart, Sector, Label } from "recharts";
import type { PieSectorDataItem } from "recharts/types/polar/Pie";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PALETTE = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
];

type Slice = {
  categoryId: number | null;
  category: string;
  value: number;
  fill?: string;
};

export function MonthlyCategoryPie({
  data,
  title = "Költések kategóriánként",
  subtitle,
}: {
  data: Slice[];
  title?: string;
  subtitle?: string;
}) {
  const colored = React.useMemo<Slice[]>(
    () =>
      (data ?? []).map((d, i) => ({
        ...d,
        fill: PALETTE[i % PALETTE.length],
      })),
    [data]
  );

  const [activeKey, setActiveKey] = React.useState(colored[0]?.category ?? "");

  const activeIndex = React.useMemo(
    () => colored.findIndex((s) => s.category === activeKey),
    [activeKey, colored]
  );

  const chartConfig = React.useMemo<ChartConfig>(() => {
    const entries = Object.fromEntries(
      colored.map((s) => [
        s.category,
        { label: s.category, color: s.fill || "var(--chart-1)" },
      ])
    );
    return entries as ChartConfig;
  }, [colored]);

  const categories = React.useMemo(
    () => colored.map((s) => s.category),
    [colored]
  );

  const id = "monthly-category-pie";
  const total = colored.reduce((acc, s) => acc + s.value, 0);

  if (!colored.length) {
    return (
      <Card className="flex h-full w-full flex-col">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {subtitle && <CardDescription>{subtitle}</CardDescription>}
        </CardHeader>
        <CardContent className="pb-4 text-sm text-muted-foreground">
          Nincs adat a megadott időszakra.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-chart={id} className="flex h-full w-full flex-col">
      <ChartStyle id={id} config={chartConfig} />

      <CardHeader className="flex flex-col items-start gap-3 pb-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="grid gap-1">
          <CardTitle>{title}</CardTitle>
          {subtitle && <CardDescription>{subtitle}</CardDescription>}
        </div>

        {categories.length > 0 && (
          <Select value={activeKey} onValueChange={setActiveKey}>
            <SelectTrigger className="h-8 w-full max-w-[220px] rounded-lg pl-2.5 text-xs sm:text-sm">
              <SelectValue placeholder="Válassz kategóriát" />
            </SelectTrigger>
            <SelectContent align="end" className="rounded-xl">
              {categories.map((name) => (
                <SelectItem
                  key={name}
                  value={name}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-xs"
                      style={{
                        backgroundColor:
                          (chartConfig[name]?.color as string) ?? "",
                      }}
                    />
                    {name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </CardHeader>

      <CardContent className="flex flex-1 items-center justify-center pb-4">
        <div className="mx-auto w-full max-w-md sm:max-w-lg">
          <ChartContainer
            id={id}
            config={chartConfig}
            className="h-[260px] w-full sm:h-[320px] md:h-[360px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={colored}
                dataKey="value"
                nameKey="category"
                innerRadius={60}
                strokeWidth={5}
                activeIndex={Math.max(activeIndex, 0)}
                activeShape={({
                  outerRadius = 0,
                  ...props
                }: PieSectorDataItem) => (
                  <g>
                    <Sector {...props} outerRadius={outerRadius + 10} />
                    <Sector
                      {...props}
                      outerRadius={outerRadius + 25}
                      innerRadius={outerRadius + 12}
                    />
                  </g>
                )}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      const value =
                        colored[
                          Math.max(activeIndex, 0)
                        ]?.value?.toLocaleString("hu-HU") ?? "0";

                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-2xl font-bold"
                          >
                            {value} Ft
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 20}
                            className="fill-muted-foreground text-xs"
                          >
                            Összesen: {total.toLocaleString("hu-HU")} Ft
                          </tspan>
                        </text>
                      );
                    }
                    return null;
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
