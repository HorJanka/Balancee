export type SpendingLimitState = {
  limit: string;
  start: Date | undefined;
  end: Date | undefined;
};

export type SpendingLimitErrors = {
  limit: string;
  start: string;
  end: string;
  other: string;
  no: number;
};

export function validateSpendingLimit(formData: SpendingLimitState) {
  const errors: SpendingLimitErrors = {
    limit: "",
    start: "",
    end: "",
    other: "",
    no: 0,
  };

  if (!formData.limit || formData.limit === "") {
    errors.limit = "Az limit megadása kötelező.";
    errors.no++;
    return errors;
  }

  const limit = parseInt(formData.limit);

  if (limit <= 0) {
    errors.limit = "Az limitnek pozitív számnak kell lennie.";
    errors.no++;
  }

  if (!formData.start) {
    errors.start = "Kezdeti dátum megadása kötelező.";
    errors.no++;
  }
  console.log(formData.start);

  if (!formData.end) {
    errors.end = "Befejezési dátum megadása kötelező.";
    errors.no++;
  }

  if (formData.start && formData.end) {
    if (formData.start > formData.end) {
      errors.other = "Befejezési dátum nem lehet hamarabb mint a kezdeti dátum";
      errors.no++;
    }
  }

  return errors;
}
