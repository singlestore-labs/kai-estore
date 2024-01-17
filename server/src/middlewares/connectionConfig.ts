import { RequestHandler } from "express";

import { parseConnectionConfigCookie } from "@/utils/connection";

export const connectionConfig: RequestHandler = async (req, res, next) => {
  try {
    const connectionConfig = parseConnectionConfigCookie(req.cookies);
    req.connectionConfig = connectionConfig;
    return next();
  } catch (error) {
    return next(error);
  }
};
