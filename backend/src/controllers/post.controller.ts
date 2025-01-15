import { Request, Response } from "express";
import { db } from "../db/db.js";
import { posts } from "../models/post.model.js";
import { users } from "../models/user.model.js";
import { comments } from "../models/comment.model.js";
import { eq } from "drizzle-orm";
import asyncHandler from "../utils/asyncHanlder.js";
import APIErrorResponse from "../lib/APIErrorResponse.js";
import APISuccessResponse from "../lib/APISuccessResponse.js";

export const createPost = asyncHandler(async (req: Request, res: Response) => {
  const { title, content } = req.body;

  if (!req.user?.id) {
    throw new APIErrorResponse(401, "User not authenticated");
  }

  if (!title?.trim() || !content?.trim()) {
    throw new APIErrorResponse(400, "Title and content are required");
  }

  try {
    const post = await db
      .insert(posts)
      .values({
        title: title.trim(),
        content: content.trim(),
        authorId: req.user.id,
      })
      .returning();

    return res
      .status(201)
      .json(new APISuccessResponse(201, post[0], "Post created successfully"));
  } catch (error) {
    console.error("Post creation error:", error);
    throw new APIErrorResponse(500, "Failed to create post");
  }
});

export const getAllPosts = asyncHandler(async (req: Request, res: Response) => {
  try {
    const allPosts = await db.select().from(posts);
    if (allPosts.length == 0)
      throw new APIErrorResponse(404, "No posts available");
    console.log(allPosts);
    return res
      .status(200)
      .json(
        new APISuccessResponse(200, allPosts, "Posts retrieved successfully")
      );
  } catch (error) {
    throw new APIErrorResponse(500, "Failed to fetch posts");
  }
});

export const getPostById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const [post] = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        author: {
          id: users.id,
          name: users.fullName,
        },
        comments: comments.content,
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .leftJoin(comments, eq(posts.id, comments.postId))
      .where(eq(posts.id, id));

    if (!post) {
      throw new APIErrorResponse(404, "Post not found");
    }

    return res
      .status(200)
      .json(new APISuccessResponse(200, post, "Post retrieved successfully"));
  } catch (error) {
    if (error instanceof APIErrorResponse) throw error;
    throw new APIErrorResponse(500, "Failed to fetch post");
  }
});

export const updatePost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!req.user) {
    throw new APIErrorResponse(401, "User not authenticated");
  }

  try {
    const [existingPost] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id));

    if (!existingPost) {
      throw new APIErrorResponse(404, "Post not found");
    }

    if (existingPost.authorId !== req.user.id) {
      throw new APIErrorResponse(403, "Unauthorized to update this post");
    }

    const [updatedPost] = await db
      .update(posts)
      .set({
        title: title || existingPost.title,
        content: content || existingPost.content,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, id))
      .returning();

    return res
      .status(200)
      .json(
        new APISuccessResponse(200, updatedPost, "Post updated successfully")
      );
  } catch (error) {
    if (error instanceof APIErrorResponse) throw error;
    throw new APIErrorResponse(500, "Failed to update post");
  }
});

export const deletePost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!req.user) {
    throw new APIErrorResponse(401, "User not authenticated");
  }

  try {
    const [existingPost] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id));

    if (!existingPost) {
      throw new APIErrorResponse(404, "Post not found");
    }

    if (existingPost.authorId !== req.user.id) {
      throw new APIErrorResponse(403, "Unauthorized to delete this post");
    }

    await db.delete(posts).where(eq(posts.id, id));

    return res
      .status(200)
      .json(new APISuccessResponse(200, {}, "Post deleted successfully"));
  } catch (error) {
    if (error instanceof APIErrorResponse) throw error;
    throw new APIErrorResponse(500, "Failed to delete post");
  }
});
