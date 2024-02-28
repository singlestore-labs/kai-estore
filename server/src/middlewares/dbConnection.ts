import { RequestHandler } from "express";

import { createDBConnection } from "@/utils/db";
import { processEnv } from "@/utils/env";

const { DB_URI, DB_NAME } = processEnv();

export const dbConnection: RequestHandler = async (req, res, next) => {
  try {
    if (req.query?.connection !== "config") {
      req.connectionConfig.mongoURI = DB_URI;
      req.connectionConfig.dbName = DB_NAME;
    }

    const { client, db } = await createDBConnection(req.connectionConfig);

    req.dbClient = client;
    req.db = db;
    return next();
  } catch (error) {
    return next(error);
  }
};
