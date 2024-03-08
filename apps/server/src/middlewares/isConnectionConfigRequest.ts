import { RequestHandler } from "express";

export const isConnectionConfigRequest: RequestHandler = async (req, res, next) => {
  try {
    req.isConnectionConfigRequest = req.query?.connection === "config";
    return next();
  } catch (error) {
    return next(error);
  }
};
