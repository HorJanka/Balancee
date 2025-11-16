import {
  users,
  categories,
  transactions,
  monthlyIncome,
  spendingLimit,
} from "./schema";

export type User = typeof users.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type MonthlyIncome = typeof monthlyIncome.$inferSelect;
export type SpendingLimit = typeof spendingLimit.$inferSelect;

export type NewUser = typeof users.$inferInsert;
export type NewCategory = typeof categories.$inferInsert;
export type NewTransaction = typeof transactions.$inferInsert;
export type NewMonthlyIncome = typeof monthlyIncome.$inferInsert;
export type NewSpendingLimit = typeof spendingLimit.$inferInsert;
