import express from "express";

import { createUser } from "@/utils/data";
import { withDuration } from "@/utils/helpers";
import { getUserRecommProductsQuery } from "@/queries/getUserRecommProducts";
import { setResponseConnectionConfigHeader } from "@/utils/connection";

export const userRouter = express.Router();

userRouter.post("/user", async (req, res, next) => {
  const { db, dbClient, connectionConfig } = req;
  try {
    if (!connectionConfig) {
      throw new Error("Connection config is undefined");
    }

    let userId = connectionConfig.userId;

    if (!userId) {
      const user = createUser();
      await db.collection("users").insertOne(user);
      userId = user.id;
      setResponseConnectionConfigHeader(res, { ...connectionConfig, userId });
    }
    await dbClient.close();
    return res.status(201).json({ id: userId });
  } catch (error) {
    await dbClient.close();
    return next(error);
  }
});

userRouter.get("/user/orders", async (req, res, next) => {
  const {
    db,
    dbClient,
    connectionConfig: { userId }
  } = req;
  try {
    const orders = await db.collection("orders").find({ userId }).toArray();
    await dbClient.close();
    return res.status(200).send(orders);
  } catch (error) {
    await dbClient.close();
    return next(error);
  }
});

userRouter.get("/user/ratings", async (req, res, next) => {
  const {
    db,
    dbClient,
    connectionConfig: { userId }
  } = req;
  try {
    const ratings = await db.collection("ratings").find({ userId }).toArray();
    await dbClient.close();
    return res.status(200).send(ratings);
  } catch (error) {
    await dbClient.close();
    return next(error);
  }
});

userRouter.get("/user/recomm-products", async (req, res, next) => {
  const {
    db,
    dbClient,
    connectionConfig: { userId }
  } = req;
  try {
    const products = await withDuration(() => getUserRecommProductsQuery(db, userId));
    await dbClient.close();
    return res.status(200).send(products);
  } catch (error) {
    await dbClient.close();
    return next(error);
  }
});
