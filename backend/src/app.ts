import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { handleErrors, notFound } from "./middlewares/errorHandler.js";
import { clerkMiddleware } from "@clerk/express";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// Apply Clerk middleware
app.use(clerkMiddleware());

import postRoutes from "./routes/post.routes.js";
import userRoutes from "./routes/user.routes.js";
// Apply routes
app.use("/api", postRoutes);
app.use("/api", userRoutes);

app.get("/", (req: Request, res: Response): void => {
  res.status(200).json({
    message: "Welcome to drugboard.ai API...",
  });
});

app.use(notFound);
app.use(handleErrors);

export default app;
