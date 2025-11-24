"use client";

import { useState } from "react";
import { DataTable } from "../DataTable";
import FormModal from "../FormModal";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { columns, SpendingLimitColumn } from "./columns";
import { SpendingLimitForm } from "./SpendingLimitForm";

type Props = {
  data: SpendingLimitColumn[];
};

export function DailySpendingLimits({ data }: Props) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Napi korlátok
          <FormModal
            buttonText="Új korlát"
            buttonVariant="default"
            title="Új napi korlát létrehozása"
            open={open}
            setOpen={setOpen}
          >
            <SpendingLimitForm setOpen={setOpen} isMonthly={false} />
          </FormModal>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <DataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
}
