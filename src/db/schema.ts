import { pgTable, integer, varchar, timestamp } from 'drizzle-orm/pg-core';

export const testTable = pgTable('testTable', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
});