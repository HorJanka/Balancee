"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  spending: {
    label: "Költés",
    color: "var(--primary)",
  },
  limit: {
    label: "Korlát",
    color: "var(--destructive)", // Red color
  },
} satisfies ChartConfig;

interface Props {
  chartData: object[];
  title: string;
  description: string;
  XAxisDataKey: string;
  limitDataKey?: string;
}

export function ChartLineLinear({
  chartData,
  title,
  description,
  XAxisDataKey,
  limitDataKey = "limit",
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-auto lg:h-100">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={XAxisDataKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Line
              dataKey="spending"
              type="linear"
              stroke="var(--color-spending)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey={limitDataKey}
              type="linear"
              stroke="var(--color-limit)"
              strokeWidth={2}
              dot={false}
              connectNulls={false} // Set to true if you want to connect across gaps
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
