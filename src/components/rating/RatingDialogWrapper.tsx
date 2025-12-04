import { getShouldRequestRating } from "./actions";
import RatingDialog from "./RatingDialog";

export default async function RatingDialogWrapper() {
  const shouldRequestRating = await getShouldRequestRating();
  return shouldRequestRating ? <RatingDialog /> : null;
}