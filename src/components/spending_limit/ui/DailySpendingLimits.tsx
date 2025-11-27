"use client";

import { DataTable } from "@/components/DataTable";
import FormModal from "@/components/FormModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { columns } from "../table/columns";
import { SpendingLimitColumn } from "../utils/types";
import { SpendingLimitForm } from "./SpendingLimitForm";

type Props = { data: SpendingLimitColumn[] };

export function DailySpendingLimits({ data }: Props) {
  const [formOpen, setFormOpen] = useState<boolean>(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Napi korlátok
          <FormModal
            buttonText="Új korlát"
            buttonVariant="default"
            title="Új napi korlát létrehozása"
            open={formOpen}
            setOpen={setFormOpen}
          >
            <SpendingLimitForm setOpen={setFormOpen} isMonthly={false} isEditing={false} />
          </FormModal>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <DataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
}
