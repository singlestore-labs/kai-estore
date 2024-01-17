import { RequestHandler } from "express";

import { createDBConnection } from "@/utils/db";

export const dbConnection: RequestHandler = async (req, res, next) => {
  try {
    const { client, db } = await createDBConnection(req.connectionConfig);
    req.dbClient = client;
    req.db = db;
    return next();
  } catch (error) {
    return next(error);
  }
};
