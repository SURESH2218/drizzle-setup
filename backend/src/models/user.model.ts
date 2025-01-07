// models/user.model.ts
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { posts } from "./post.model";
import { comments } from "./comment.model";

export const users = pgTable("users", {
  id: uuid("id").primaryKey(), // Will use Clerk user ID
  email: text("email").notNull().unique(),
  username: text("username").notNull(),
  fullName: text("full_name"),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
}));

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
