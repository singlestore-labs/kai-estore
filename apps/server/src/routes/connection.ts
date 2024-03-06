import express from "express";
import zod from "zod";

import { ConnectionConfig } from "@/types/connection";
import { validateRoute } from "@/middlewares/validateRoute";
import { connectionConfig } from "@/middlewares/connectionConfig";
import { setResponseConnectionConfigHeader } from "@/utils/connection";
import { createDBConnection } from "@/utils/db";
import { processEnv } from "@/utils/env";

export const connectionRouter = express.Router();

const { DB_URI, DB_NAME, DATA_SIZE, IS_SINGLE_DB } = processEnv();

const validationSchema = IS_SINGLE_DB
  ? undefined
  : zod.object({
      body: zod.object({
        mongoURI: zod.string({ required_error: "MongoURI is required" }).optional(),
        dbName: zod.string({ required_error: "Database name is required" }).optional(),
        dataSize: zod.string({ required_error: "Dataset size is required" }).optional()
      })
    });

connectionRouter.post("/connection", validateRoute(validationSchema), async (req, res, next) => {
  try {
    let config: ConnectionConfig = req.body;

    if (IS_SINGLE_DB) {
      config = {
        mongoURI: DB_URI,
        dbName: DB_NAME,
        dataSize: DATA_SIZE as ConnectionConfig["dataSize"],
        userId: ""
      };
    }

    if (!config.withCDC && !config.shouldGenerateData) {
      const { db } = await createDBConnection(config);
      const meta = await db.collection("meta").findOne();

      if (meta) {
        config.dataSize = meta.dataSize ?? config.dataSize;
      }
    }

    setResponseConnectionConfigHeader(res, config);
    return res.status(200).json({ message: "Config set" });
  } catch (error) {
    return next(error);
  }
});

connectionRouter.get("/connection", connectionConfig, async (req, res, next) => {
  try {
    return res.status(200).json(req.connectionConfig);
  } catch (error) {
    return next(error);
  }
});

connectionRouter.put(
  "/connection",
  connectionConfig,
  validateRoute(validationSchema),
  async (req, res, next) => {
    try {
      const { connectionConfig } = req;
      const { client } = await createDBConnection(req.body);
      const db = client.db(req.body.dbName);
      const meta = await db.collection("meta").findOne();
      let dataSize: ConnectionConfig["dataSize"] = req.body.dataSize;

      if (meta) {
        if (connectionConfig.dbName !== req.body.dbName) {
          dataSize = meta.dataSize !== req.body.dataSize ? req.body.dataSize : meta.dataSize;
        }

        if (!req.body.shouldGenerateData) {
          dataSize = meta.dataSize;
        }
      }

      setResponseConnectionConfigHeader(res, { ...connectionConfig, ...req.body, dataSize });
      client.close();
      return res.status(200).json({ message: "Config updated" });
    } catch (error) {
      return next(error);
    }
  }
);
