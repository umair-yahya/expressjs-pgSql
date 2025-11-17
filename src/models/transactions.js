import { pgTable, serial, varchar, integer, numeric } from "drizzle-orm/pg-core";
import { users } from "./user.js";

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id),
  product: varchar("product", { length: 100 }).notNull(),
  quantity: integer("quantity").notNull(),
  price: numeric("price").notNull(),
  type: varchar("type", { length: 10 }).notNull(),
});
