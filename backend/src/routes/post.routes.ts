import { Router } from "express";
import {
  requireAuth,
  addUserDataToRequest,
} from "../middlewares/auth.middleware.js";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/post.controller.js";

const router = Router();

// Public routes
router.get("/posts", getAllPosts);
router.get("/posts/:id", getPostById);

// Protected routes
router.use(requireAuth, addUserDataToRequest);
router.post("/posts", createPost);
router.put("/posts/:id", updatePost);
router.delete("/posts/:id", deletePost);

export default router;
