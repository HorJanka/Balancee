import { getMonthlyCategorySpendings } from "./actions";
import { MonthlyCategoryPie } from "../charts/MonthlyCategoryPie";

interface Props {
  year: number;
  month: number;
}

export default async function MonthlyCategoryPage({ year, month }: Props) {
  const data = await getMonthlyCategorySpendings(year, month);

  return (
    <div>
      <MonthlyCategoryPie
        data={data}
        title="Havi költések kategóriánként"
        subtitle={`${year}.${String(month).padStart(2, "0")}`}
      />
    </div>
  );
}
