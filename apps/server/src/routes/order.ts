import express from "express";
import zod from "zod";

import { validateRoute } from "@/middlewares/validateRoute";
import { createFlatOrders } from "@/utils/data";

export const orderRouter = express.Router();

orderRouter.post(
  "/order",
  validateRoute(zod.object({ body: zod.object({ productIds: zod.array(zod.string()) }) })),
  async (req, res, next) => {
    const {
      db,
      dbClient,
      connectionConfig: { userId }
    } = req;
    try {
      const body: { productIds: string[] } = req.body;
      const flatOrders = createFlatOrders(userId, body.productIds);
      await db.collection("orders").insertMany(flatOrders);
      await dbClient.close();
      return res.status(201).send(flatOrders);
    } catch (error) {
      await dbClient.close();
      return next(error);
    }
  }
);
