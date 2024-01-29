import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: int("id").primaryKey().$type<string>(),
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  joined_at: text("joined_at").notNull(),
  date_of_birth: text("date_of_birth").notNull(),
  salary: int("salary").notNull(),
  title: text("title").notNull(),
  department: text("department").notNull(),
});
