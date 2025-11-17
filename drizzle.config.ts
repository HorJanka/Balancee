import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  driver: 'pglite', // Use this for Neon HTTP
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
