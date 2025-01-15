import { Router } from "express";
import { getAuth } from "@clerk/express";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/post.controller.js";
import { authMiddleware, addUserDataToRequest } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.get("/posts", getAllPosts);
router.get("/posts/:id", getPostById);

// Protected routes
router.use(authMiddleware);  
router.use(addUserDataToRequest);

router.post("/posts", createPost);
router.put("/posts/:id", updatePost);
router.delete("/posts/:id", deletePost);

export default router;