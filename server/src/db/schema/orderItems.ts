import {
  doublePrecision,
  integer,
  pgTable,
  varchar,
} from "drizzle-orm/pg-core";
import timestampFields from "./timestampFields";
import { usersTable } from "./users";
import { ordersTable } from "./orders";
import { productsTable } from "./products";
import { createInsertSchema } from "drizzle-zod";

export const orderItemsTable = pgTable("order_items", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  orderId: integer()
    .references(() => ordersTable.id)
    .notNull(),
  productId: integer()
    .references(() => productsTable.id)
    .notNull(),
  quantity: integer().notNull(),
  price: doublePrecision().notNull(),
  ...timestampFields,
});

export const createOrderItemSchema = createInsertSchema(orderItemsTable).omit({
  id: true,
  orderId: true,
  createdAt: true,
  updatedAt: true,
});
