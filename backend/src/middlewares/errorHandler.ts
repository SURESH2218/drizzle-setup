import { Request, Response, NextFunction } from "express";
import APIErrorResponse from "../lib/APIErrorResponse.js";

// Development error handler - includes stack trace
const developmentErrors = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.stack = err.stack || "";
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message,
      stack: err.stack,
      ...(err.errors && { errors: err.errors }),
    },
  });
};

// Production error handler - no stacktraces leaked to user
const productionErrors = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message,
    ...(err.errors && { errors: err.errors }),
  });
};

// Handle 404 errors
const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new APIErrorResponse(404, `Route ${req.originalUrl} not found`);
  next(error); // Pass the error to the next middleware
};

// Catch all error handling
const handleErrors = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (process.env.NODE_ENV === "production") {
    productionErrors(err, req, res, next);
  } else {
    developmentErrors(err, req, res, next);
  }
};

export { developmentErrors, productionErrors, notFound, handleErrors };
