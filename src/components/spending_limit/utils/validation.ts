import {
  SpendingLimitColumn,
  SpendingLimitErrors,
  SpendingLimitsIntervals,
  SpendingLimitState,
} from "./types";

export function validateSpendingLimit({
  formData,
  spendingLimitsIntervals,
  isEditing,
  spendingLimit,
}: {
  formData: SpendingLimitState;
  spendingLimitsIntervals: SpendingLimitsIntervals[] | undefined;
  isEditing: boolean;
  spendingLimit?: SpendingLimitColumn;
}) {
  const errors: SpendingLimitErrors = {
    limit: "",
    start: "",
    end: "",
    other: "",
    interval: "",
    no: 0,
  };

  // Limit
  if (!formData.limit || formData.limit === "") {
    errors.limit = "Az limit megadása kötelező.";
    errors.no++;
    return errors;
  }

  const limit = Number(formData.limit);

  if (limit <= 0) {
    errors.limit = "Az limitnek pozitív számnak kell lennie.";
    errors.no++;
  }

  // Start date
  if (!formData.start) {
    errors.start = "Kezdeti dátum megadása kötelező.";
    errors.no++;
  }

  // End date
  if (!formData.end) {
    errors.end = "Befejezési dátum megadása kötelező.";
    errors.no++;
  }

  // Date order
  if (formData.start && formData.end && formData.start > formData.end) {
    errors.other = "Befejezési dátum nem lehet hamarabb mint a kezdeti dátum.";
    errors.no++;
  }

  console.log(isEditing, spendingLimit);

  // Interval overlap
  if (spendingLimitsIntervals && formData.start && formData.end) {
    const overlap = spendingLimitsIntervals
      .filter((interval) => !isEditing || interval.id !== spendingLimit?.id)
      .some((interval) => formData.start! <= interval.end && formData.end! >= interval.start);

    if (overlap) {
      errors.interval = "Nem fedhetik egymást az időintervallumok.";
      errors.no++;
    }
  }

  return errors;
}
