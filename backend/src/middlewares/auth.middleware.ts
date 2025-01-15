declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
      };
      user?: {
        id: string;
      };
    }
  }
}

import { requireAuth, getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";
import APIErrorResponse from "../lib/APIErrorResponse.js";

export const authMiddleware = requireAuth();

// Add user data to the request
export const addUserDataToRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const auth = getAuth(req);
    if (!auth.userId) {
      throw new APIErrorResponse(401, "Unauthorized access");
    }

    req.user = {
      id: auth.userId,
    };
    console.log(req.user);
    next();
  } catch (error) {
    next(error);
  }
};
