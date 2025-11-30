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

type Slice = {
  categoryId: number | null;
  category: string;
  value: number;
  color: string;
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
  const [activeKey, setActiveKey] = React.useState(data[0]?.category ?? "");

  const activeIndex = React.useMemo(
    () => data.findIndex((s) => s.category === activeKey),
    [activeKey, data]
  );

  const chartConfig = React.useMemo<ChartConfig>(() => {
    const entries = Object.fromEntries(
      data.map((s) => [s.category, { label: s.category, color: s.color }])
    );
    return entries as ChartConfig;
  }, [data]);

  const categories = React.useMemo(() => data.map((s) => s.category), [data]);

  const id = "monthly-category-pie";
  const total = data.reduce((acc, s) => acc + s.value, 0);

  if (!data.length) {
    return (
      <Card className="flex h-full flex-col">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {subtitle && <CardDescription>{subtitle}</CardDescription>}
        </CardHeader>
        <CardContent className="min-h-[100px] min-w-[350px] md:min-h-[100px] md:min-w-[1000px] max-w-screen">
          Nincs adat a megadott időszakra.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-chart={id} className="flex h-full flex-col">
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

      <CardContent className="min-h-[100px] min-w-[350px] md:min-h-[100px] md:min-w-[1000px] max-w-screen">
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
                data={data.map((value) => ({ ...value, fill: value.color }))}
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
                        data[Math.max(activeIndex, 0)]?.value?.toLocaleString(
                          "hu-HU"
                        ) ?? "0";

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
