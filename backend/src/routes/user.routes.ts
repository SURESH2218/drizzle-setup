import { Router } from "express";
import {
  getCurrentUser,
  handleClerkWebhook,
} from "../controllers/user.controller.js";

const router = Router();

router.post("/webhooks/clerk", handleClerkWebhook);
router.get("/current-user", getCurrentUser);

export default router;
