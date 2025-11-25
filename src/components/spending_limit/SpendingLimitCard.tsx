"use client";

import { Card, CardContent } from "../ui/card";

export function SpendingLimitCard() {
  return (
    <Card className="relative">
      <CardContent>
        {/* Daily limit */}
        <div className="flex flex-col pb-2 pr-8">
          <div className="flex justify-between items-center gap-10">
            <span className="text-md font-semibold">Napi korlát</span>
            <span className="text-xs text-destructive">... Ft-tal túllépve</span>
          </div>
          <p className="flex gap-2 text-2xl font-semibold pl-8">
            <span className="text-destructive">------ Ft</span>
            <span className="text-muted-foreground"> / ------ Ft</span>
          </p>
        </div>

        <div className="border-t" />

        {/* Monthly limit */}
        <div className="flex flex-col pt-2 pr-8">
          <div className="flex justify-between items-center gap-10">
            <span className="text-md font-semibold">Havi korlát</span>
            <span className="text-xs text-primary">még ... Ft</span>
          </div>
          <p className="flex gap-2 text-2xl font-semibold pl-8">
            <span className="text-primary">------ Ft</span>
            <span className="text-muted-foreground"> / ------ Ft</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
