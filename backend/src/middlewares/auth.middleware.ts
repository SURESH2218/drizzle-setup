declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
      };
      user?: {
        id: string;
        // Add other user properties types here
      };
    }
  }
}

import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { Request, Response, NextFunction } from "express";
import APIErrorResponse from "../lib/APIErrorResponse.js";

export const requireAuth = ClerkExpressRequireAuth({
  onError: (error) => {
    throw new APIErrorResponse(401, "Unauthorized access");
  },
});

// Add user data to the request
export const addUserDataToRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.auth?.userId) {
      throw new APIErrorResponse(401, "Unauthorized access");
    }
    // Add typed user data to the request
    req.user = {
      id: req.auth.userId,
      // Add other user properties as needed
    };
    next();
  } catch (error) {
    next(error);
  }
};
