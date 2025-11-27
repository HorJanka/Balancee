"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type MonthlyRow = {
  month: number; // 1–12
  income: number;
  expense: number;
  balance: number;
};

type Props = {
  data: MonthlyRow[];
  year: number;
};

const chartConfig: ChartConfig = {
  income: {
    label: "Bevétel",
    color: "var(--chart-1)",
  },
  expense: {
    label: "Kiadás",
    color: "var(--chart-2)",
  },
  balance: {
    label: "Maradék",
    color: "var(--chart-3)",
  },
};

const MONTH_NAMES_SHORT = [
  "Jan",
  "Feb",
  "Már",
  "Ápr",
  "Máj",
  "Jún",
  "Júl",
  "Aug",
  "Szep",
  "Okt",
  "Nov",
  "Dec",
];

export function MonthlySpendingAndIncomeBarChart({ data, year }: Props) {
  const chartData = data.map((row) => ({
    ...row,
    monthLabel: MONTH_NAMES_SHORT[row.month - 1] ?? String(row.month),
  }));

  const totalIncome = data.reduce((acc, r) => acc + r.income, 0);
  const totalExpense = data.reduce((acc, r) => acc + r.expense, 0);
  const totalBalance = data.reduce((acc, r) => acc + r.balance, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Éves összesítés</CardTitle>
        <CardDescription>{year}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="monthLabel"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="income" fill="var(--color-income)" radius={4} />
            <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
            <Bar dataKey="balance" fill="var(--color-balance)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex gap-4 flex-wrap text-sm">
        <div
          className="flex flex-col p-3 rounded-lg border"
          style={{
            borderColor: "var(--chart-income)",
          }}
        >
          <span className="text-xs text-muted-foreground">Összes bevétel</span>
          <span className="font-semibold">
            {totalIncome.toLocaleString("hu-HU")} Ft
          </span>
        </div>

        <div
          className="flex flex-col p-3 rounded-lg border"
          style={{
            borderColor: "var(--chart-expense)",
          }}
        >
          <span className="text-xs text-muted-foreground">Összes kiadás</span>
          <span className="font-semibold">
            {totalExpense.toLocaleString("hu-HU")} Ft
          </span>
        </div>

        <div
          className="flex flex-col p-3 rounded-lg border"
          style={{
            borderColor: "var(--chart-balance)",
          }}
        >
          <span className="text-xs text-muted-foreground">Éves maradék</span>
          <span className="font-semibold">
            {totalBalance.toLocaleString("hu-HU")} Ft
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
