import { timestamp } from "drizzle-orm/pg-core";

const timestampFields = {
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .$onUpdate(() => new Date()),
};
export default timestampFields;
