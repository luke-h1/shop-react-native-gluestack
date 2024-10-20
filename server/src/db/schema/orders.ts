import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import timestampFields from "./timestampFields";
import { usersTable } from "./users";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { createOrderItemSchema } from "./orderItems";

export const ordersTable = pgTable("orders", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  status: varchar({ length: 50 }).notNull().default("New"),
  userId: integer()
    .references(() => usersTable.id)
    .notNull(),

  ...timestampFields,
});

export const createOrderSchema = createInsertSchema(ordersTable).omit({
  id: true,
  userId: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderWithItemsSchema = z.object({
  order: createOrderSchema,
  items: z.array(createOrderItemSchema),
});

export const updateOrderSchema = createInsertSchema(ordersTable).pick({
  status: true,
});
