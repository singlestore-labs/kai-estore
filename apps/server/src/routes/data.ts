import express from "express";
import zod from "zod";

import { DatasetCollectionNames } from "@/types/data";

import { processDatasetFiles, validateData } from "@/utils/data";
import { processAsChunks } from "@/utils/helpers";
import { validateRoute } from "@/middlewares/validateRoute";

export const dataRouter = express.Router();

dataRouter.get("/data/validate", async (req, res, next) => {
  try {
    const { db, connectionConfig } = req;
    if (!connectionConfig.withCDC && !connectionConfig.shouldGenerateData) {
      return res.status(200).send(true);
    }
    const isValid = await validateData(db, connectionConfig.dataSize, connectionConfig.withCDC);
    return res.status(200).send(isValid);
  } catch (error) {
    return next(error);
  }
});

dataRouter.post(
  "/data/set",
  validateRoute(zod.object({ query: zod.object({ force: zod.string().optional() }) })),
  async (req, res, next) => {
    try {
      const { db, connectionConfig, query } = req;
      const isForced = query.force === "true" || query.force;
      const collectionNames: DatasetCollectionNames[] = [
        "users",
        "categories",
        "tags",
        "products",
        "ratings",
        "orders"
      ];

      if (!isForced && (await validateData(db, connectionConfig.dataSize, connectionConfig.withCDC))) {
        return res.status(200).json({ message: "Data already exists" });
      }

      await db.dropDatabase();

      for await (const collectionName of collectionNames) {
        if (connectionConfig.dataSize === "vectors" && collectionName === "products") {
          await db.createCollection(collectionName, {
            columns: [{ id: "v", type: "LONGBLOB NOT NULL" }]
          } as any);
        }

        const collection = db.collection(collectionName);

        await processDatasetFiles(collectionName, connectionConfig.dataSize, async (data) => {
          await processAsChunks(data, async (chunk) => {
            if (connectionConfig.dataSize === "vectors" && collectionName === "products") {
              chunk = chunk.map((i) => {
                const float32 = new Float32Array((i as any).v);
                const v = Buffer.from(new Uint8Array(float32.buffer));
                return { ...i, v };
              });
            }
            await collection.insertMany(prepareDates(chunk));
          });
        });
      }

      await db.collection("meta").insertOne({ dataSize: connectionConfig.dataSize });
      return res.status(201).json({ message: "Data set" });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
);

function prepareDates<T extends any[] = any[]>(arr: T) {
  return arr.map((item) => {
    if ("createdAt" in item || "updatedAt" in item) {
      item.createdAt = new Date(item.createdAt);
      item.updatedAt = new Date(item.updatedAt);
    }

    return item;
  });
}
