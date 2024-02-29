import { RequestHandler } from "express";

import { createDBConnection } from "@/utils/db";
import { processEnv } from "@/utils/env";

const { DB_URI, DB_NAME } = processEnv();

export const dbConnection: RequestHandler = async (req, res, next) => {
  try {
    const isConfig = req.query?.connection === "config";

    const { client, db } = await createDBConnection({
      ...req.connectionConfig,
      mongoURI: isConfig ? req.connectionConfig.mongoURI : DB_URI,
      dbName: isConfig ? req.connectionConfig.dbName : DB_NAME,
    });

    req.dbClient = client;
    req.db = db;
    return next();
  } catch (error) {
    return next(error);
  }
};
