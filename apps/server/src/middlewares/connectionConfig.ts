import { RequestHandler } from "express";

import { parseConnectionConfigHeader } from "@/utils/connection";
import { DatasetSizes } from "@/types/data";
import { ConnectionConfig } from "@/types/connection";

export const connectionConfig: RequestHandler = async (req, res, next) => {
  try {
    let connectionConfig: ConnectionConfig;

    if (!req.isConnectionConfigRequest && !["/user"].includes(req.url)) {
      connectionConfig = { mongoURI: "", dbName: "", userId: "", dataSize: "" as DatasetSizes };
    } else {
      connectionConfig = parseConnectionConfigHeader(req.headers);
    }

    req.connectionConfig = connectionConfig;
    return next();
  } catch (error) {
    return next(error);
  }
};
