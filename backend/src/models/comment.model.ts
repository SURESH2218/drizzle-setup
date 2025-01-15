// models/comment.model.ts
import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./user.model";
import { posts } from "./post.model";

export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  content: text("content").notNull(),
  authorId: varchar("author_id", { length: 256 })
    .references(() => users.id)
    .notNull(),
  postId: uuid("post_id")
    .references(() => posts.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const commentsRelations = relations(comments, ({ one }) => ({
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
}));

// Types
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
