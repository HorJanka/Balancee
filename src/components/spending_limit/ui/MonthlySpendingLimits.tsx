"use client";

import { DataTable } from "@/components/DataTable";
import FormModal from "@/components/FormModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { columns } from "../table/columns";
import { SpendingLimitColumn } from "../utils/types";
import { SpendingLimitForm } from "./SpendingLimitForm";

export function MonthlySpendingLimits({ data }: { data: SpendingLimitColumn[] }) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Havi korlátok
          <FormModal
            buttonText="Új korlát"
            buttonVariant="default"
            title="Új havi korlát létrehozása"
            open={open}
            setOpen={setOpen}
          >
            <SpendingLimitForm setOpen={setOpen} isMonthly={true} isEditing={false} />
          </FormModal>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <DataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
}
