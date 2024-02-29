import { RequestHandler } from "express";

import { parseConnectionConfigHeader } from "@/utils/connection";

export const connectionConfig: RequestHandler = async (req, res, next) => {
  try {
    const connectionConfig = parseConnectionConfigHeader(req);
    req.connectionConfig = connectionConfig;
    return next();
  } catch (error) {
    return next(error);
  }
};
