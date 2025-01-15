import { drizzle } from "drizzle-orm/node-postgres";
import { config } from "dotenv";
import pg from "pg";
config({ path: ".env" });

let db: ReturnType<typeof drizzle>;

export const connectDB = async (): Promise<typeof db> => {
  try {
    // Create a PostgreSQL client
    const client = new pg.Client({
      connectionString: process.env.DATABASE_URL, // Your DATABASE_URL from .env
    });

    // Connect to the database
    await client.connect();

    // Initialize drizzle ORM with the client
    db = drizzle({ client, logger: true });

    console.log("👍 Database connected successfully");
    return db;
  } catch (error: any) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

export { db };
