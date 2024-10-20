import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: [
    "./src/db/schema/orderItems.ts",
    "./src/db/schema/orders.ts",
    "./src/db/schema/products.ts",
    "./src/db/schema/users.ts",
    "./src/db/schema/timestampFields.ts",
  ],
  dialect: "postgresql",
  dbCredentials: {
    // @ts-expect-error
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
