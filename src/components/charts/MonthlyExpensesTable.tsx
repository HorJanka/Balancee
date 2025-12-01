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
import FormModal from "@/components/FormModal";
import { EditExpenseForm } from "@/components/modal_forms/EditExpenseForm";
import { EditIncomeForm } from "@/components/modal_forms/EditIncomeForm";
import { deleteTransaction } from "../MonthlyExpenses/actions";

type CategoryOption = { id: number | string; name: string };

type MonthlyExpenseRow = {
  id: number | string;
  categoryId?: number | null;
  categoryName?: string | null;
  description?: string | null;
  amount: number;
  occurredAt: Date | string;
  categoryColor?: string | null;
};

export function MonthlyExpensesTable({
  data = [],
  categories = [],
  title = "Havi tranzakciók",
  subtitle,
}: {
  data?: MonthlyExpenseRow[];
  categories?: CategoryOption[];
  title?: string;
  subtitle?: string;
}) {
  const safeData = data ?? [];
  const totalNet = safeData.reduce((sum, row) => sum + row.amount, 0);
  const totalIsIncome = totalNet >= 0;
  const totalDisplay = Math.abs(totalNet);

  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [deletingId, setDeletingId] = React.useState<number | string | null>(
    null
  );

  const [editExpenseOpen, setEditExpenseOpen] = React.useState(false);
  const [editingExpenseRow, setEditingExpenseRow] =
    React.useState<MonthlyExpenseRow | null>(null);

  const [editIncomeOpen, setEditIncomeOpen] = React.useState(false);
  const [editingIncomeRow, setEditingIncomeRow] =
    React.useState<MonthlyExpenseRow | null>(null);

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

  function handleEdit(row: MonthlyExpenseRow) {
    if (row.amount < 0) {
      setEditingExpenseRow(row);
      setEditExpenseOpen(true);
    } else {
      setEditingIncomeRow(row);
      setEditIncomeOpen(true);
    }
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>{title}</CardTitle>
            {subtitle && <CardDescription>{subtitle}</CardDescription>}
          </div>
        </CardHeader>
        <CardContent className="min-h-[100px] min-w-[350px] md:min-h-[100px] md:min-w-[1000px] max-w-screen">
          <div className="w-full overflow-x-auto">
            <Table>
              <TableCaption>Az adott hónap bevételei és kiadásai.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Dátum</TableHead>
                  <TableHead>Leírás</TableHead>
                  <TableHead>Kategória</TableHead>
                  <TableHead className="whitespace-nowrap text-right">
                    Összeg
                  </TableHead>
                  <TableHead className="w-[1%] whitespace-nowrap text-right">
                    Akciók
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {safeData.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-8 text-center text-sm text-muted-foreground"
                    >
                      Nincs tranzakció ebben a hónapban.
                    </TableCell>
                  </TableRow>
                )}

                {safeData.map((row) => {
                  const isIncome = row.amount > 0;
                  const displayAmount = Math.abs(row.amount);
                  const amountBg = isIncome
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-700";

                  const isDeleting = isPending && deletingId === row.id;

                  return (
                    <TableRow key={row.id}>
                      <TableCell className="whitespace-nowrap align-center text-xs sm:text-sm">
                        {new Date(row.occurredAt).toLocaleDateString("hu-HU")}
                      </TableCell>

                      <TableCell className="max-w-[420px] align-center text-xs text-muted-foreground sm:text-sm whitespace-normal break-words">
                        {row.description || "—"}
                      </TableCell>

                      <TableCell className="align-center">
                        {isIncome ? (
                          <span className="text-xs text-muted-foreground">
                            —
                          </span>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-[unset]"
                            style={{
                              backgroundColor: row.categoryColor ?? "#888888",
                              color: "white",
                            }}
                          >
                            {row.categoryName || "Egyéb"}
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell className="text-right align-center">
                        <span
                          className={`inline-flex items-center justify-end rounded-md px-2 py-1 text-xs font-semibold ${amountBg}`}
                        >
                          {displayAmount.toLocaleString("hu-HU")} Ft
                        </span>
                      </TableCell>

                      <TableCell className="text-right align-center">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(row)}
                          >
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

                {safeData.length > 0 && (
                  <TableRow className="border-t-2 border-border">
                    <TableCell
                      colSpan={3}
                      className="text-right text-sm font-medium"
                    >
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
          </div>
        </CardContent>
      </Card>

      {editingExpenseRow && (
        <FormModal
          title="Kiadás szerkesztése"
          buttonText=""
          buttonVariant="ghost"
          open={editExpenseOpen}
          setOpen={setEditExpenseOpen}
        >
          <EditExpenseForm
            categories={categories}
            setOpen={setEditExpenseOpen}
            initial={{
              id: editingExpenseRow.id,
              amount: editingExpenseRow.amount,
              categoryId: editingExpenseRow.categoryId ?? null,
              description: editingExpenseRow.description ?? null,
              occurredAt:
                editingExpenseRow.occurredAt instanceof Date
                  ? editingExpenseRow.occurredAt
                  : new Date(editingExpenseRow.occurredAt),
            }}
          />
        </FormModal>
      )}

      {editingIncomeRow && (
        <FormModal
          title="Bevétel szerkesztése"
          buttonText=""
          buttonVariant="ghost"
          open={editIncomeOpen}
          setOpen={setEditIncomeOpen}
        >
          <EditIncomeForm
            setOpen={setEditIncomeOpen}
            initial={{
              id: editingIncomeRow.id,
              amount: editingIncomeRow.amount,
              description: editingIncomeRow.description ?? null,
              occurredAt:
                editingIncomeRow.occurredAt instanceof Date
                  ? editingIncomeRow.occurredAt
                  : new Date(editingIncomeRow.occurredAt),
            }}
          />
        </FormModal>
      )}
    </>
  );
}
