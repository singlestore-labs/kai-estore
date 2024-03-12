import express from "express";

import { DB_NAME, DB_URI } from "@/constants/env";
import { CDC } from "@/types/data";
import { cdcDataInfo } from "@/utils/cdc";
import { REQUIRED_COLLECTION_NAMES } from "@/constants/db";

export const cdcRouter = express.Router();

cdcRouter.post("/cdc", async (req, res, next) => {
  try {
    const { db } = req;
    const linkName = "mongolink";
    await db.dropDatabase();
    await db.command({ createLink: linkName, uri: DB_URI, include: `${DB_NAME}.*` });
    for (const collection of REQUIRED_COLLECTION_NAMES) {
      db.createCollection(collection, { from: { link: linkName, database: DB_NAME, collection } } as any);
    }
    // await db.command({ createCollectionsFromSource: "mongolink" });
    await db.collection<CDC>("cdc").insertOne({ status: "cloning" });
    return res.status(200).send();
  } catch (error) {
    return next(error);
  }
});

cdcRouter.get("/cdc", async (req, res, next) => {
  try {
    const { db } = req;
    const cdc = (await db.collection<CDC>("cdc").findOne()) || undefined;

    if (cdc && cdc.status !== "ready") {
      const { isReady } = await cdcDataInfo(db);
      if (isReady) {
        cdc.status = "ready";
        await db.collection<CDC>("cdc").updateOne({ _id: cdc._id }, { $set: { status: cdc.status } });
      }
    }

    return res.status(200).send(cdc);
  } catch (error) {
    return next(error);
  }
});
