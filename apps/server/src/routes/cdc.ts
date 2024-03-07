import express from "express";

import { DB_NAME, DB_URI } from "@/constants/env";
import { CDC } from "@/types/data";

export const cdcRouter = express.Router();

cdcRouter.post("/cdc", async (req, res, next) => {
  try {
    const { db } = req;
    await db.dropDatabase();
    await db.command({ createLink: "mongolink", uri: DB_URI, include: `${DB_NAME}.*` });
    await db.command({ createCollectionsFromSource: "mongolink" });
    await db.collection<CDC>("cdc").insertOne({ status: "cloning" });
    return res.status(200).send();
  } catch (error) {
    return next(error);
  }
});

cdcRouter.get("/cdc", async (req, res, next) => {
  try {
    const { db } = req;
    const cdc = await db.collection<CDC>("cdc").findOne();
    return res.status(200).send(cdc);
  } catch (error) {
    return next(error);
  }
});
