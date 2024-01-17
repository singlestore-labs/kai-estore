import { ErrorRequestHandler } from "express";
import jwt from "jsonwebtoken";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = async (error, req, res, next) => {
  if (error.status === 401 || error instanceof jwt.TokenExpiredError) {
    return res.status(401).json({ error: error.message });
  }

  if (typeof error === "string") {
    return res.status(400).json({ error });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({ error: error.errors });
  }

  if (error instanceof Error) {
    return res.status(500).json({ error: error.message, cause: error.cause });
  }

  return res.status(500).json(error);
};
