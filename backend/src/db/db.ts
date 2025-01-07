import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import * as schema from "../models";

config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });

export const connectDB = async () => {
  try {
    await sql`SELECT 1`;
    console.log("👍 Database connected successfully");
    return db;
  } catch (error: any) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};
