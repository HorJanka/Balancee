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
  interval: string;
  no: number;
};

export type SpendingLimitsIntervals = {
  id: number;
  start: Date;
  end: Date;
};

export type SpendingLimitColumn = {
  id: number;
  limit: number;
  start: Date;
  end: Date;
  isMonthly: boolean; // for dynamic formatting
};

export type SpendingResultForLimit = {
  spent: number;
  remaining: number;
  textColor: string;
  infoText: string;
};

export type Transaction = {
  day: string;
  spending: number;
};
