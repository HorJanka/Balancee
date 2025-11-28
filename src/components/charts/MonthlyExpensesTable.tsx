"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteTransaction } from "../MonthlyExpenses/deleteAction";

type MonthlyExpenseRow = {
  id: number | string;
  categoryName?: string | null;
  description?: string | null;
  amount: number;
  occurredAt: Date;
};

export function MonthlyExpensesTable({
  data,
  title = "Havi tranzakciók",
  subtitle,
}: {
  data: MonthlyExpenseRow[];
  title?: string;
  subtitle?: string;
}) {
  const totalNet = data.reduce((sum, row) => sum + row.amount, 0);
  const totalIsIncome = totalNet >= 0;
  const totalDisplay = Math.abs(totalNet);

  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [deletingId, setDeletingId] = React.useState<number | string | null>(
    null
  );

  async function handleDelete(id: number | string) {
    const ok = window.confirm("Biztosan törlöd ezt a tranzakciót?");
    if (!ok) return;

    setDeletingId(id);

    startTransition(async () => {
      try {
        await deleteTransaction(Number(id));
        router.refresh();
      } catch (err) {
        console.error("Delete failed", err);
      } finally {
        setDeletingId(null);
      }
    });
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Az hónap bevételei és kiadásai.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Dátum</TableHead>
              <TableHead>Leírás</TableHead>
              <TableHead>Kategória</TableHead>
              <TableHead className="text-right">Összeg</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  Nincs tranzakció ebben a hónapban.
                </TableCell>
              </TableRow>
            )}

            {data.map((row) => {
              const isIncome = row.amount > 0;
              const displayAmount = Math.abs(row.amount);
              const amountBg = isIncome
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700";

              const isDeleting = isPending && deletingId === row.id;

              return (
                <TableRow key={row.id}>
                  <TableCell className="whitespace-nowrap align-top">
                    {new Date(row.occurredAt).toLocaleDateString("hu-HU")}
                  </TableCell>

                  <TableCell className="max-w-[420px] text-center align-top text-sm text-muted-foreground whitespace-normal break-words max-h-18 overflow-hidden">
                    {row.description || "—"}
                  </TableCell>

                  <TableCell className="align-top">
                    {isIncome ? (
                      <span className="text-xs text-muted-foreground">—</span>
                    ) : (
                      <Badge variant="outline">
                        {row.categoryName || "Egyéb"}
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-right align-top">
                    <span
                      className={`inline-flex items-center justify-end rounded-md px-2 py-1 text-xs font-semibold ${amountBg}`}
                    >
                      {displayAmount.toLocaleString("hu-HU")} Ft
                    </span>
                  </TableCell>

                  <TableCell className="text-right align-top">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-destructive/40 text-destructive"
                        disabled={isDeleting}
                        onClick={() => handleDelete(row.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}

            {data.length > 0 && (
              <TableRow className="border-t-2 border-border">
                <TableCell colSpan={3} className="text-right font-medium">
                  Havi egyenleg összesen:
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={`inline-flex items-center justify-end rounded-md px-2 py-1 text-xs font-semibold ${
                      totalIsIncome
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {totalDisplay.toLocaleString("hu-HU")} Ft
                  </span>
                </TableCell>
                <TableCell />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
