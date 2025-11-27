import { getMonthlyCategorySpendings } from "./actions";
import { MonthlyCategoryPie } from "../charts/MonthlyCategoryPie";

export default async function MonthlyCategoryPage() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const data = await getMonthlyCategorySpendings(year, month);

  return (
    <div className="p-4">
      <MonthlyCategoryPie
        data={data}
        title="Havi költések kategóriánként"
        subtitle={`${year}.${String(month).padStart(2, "0")}`}
      />
    </div>
  );
}
