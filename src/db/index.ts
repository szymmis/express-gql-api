import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

const sql = new Database(process.env.DB_PATH || "db.sqlite3");
const db = drizzle(sql);

migrate(db, { migrationsFolder: "drizzle" });

export default db;
