import express from "express";
import { ObjectId } from "mongodb";
import zod from "zod";

import { Rating } from "@/types/data";
import { validateRoute } from "@/middlewares/validateRoute";
import { calcAverage } from "@/utils/helpers";

export const ratingRouter = express.Router();

ratingRouter.post(
  "/rating",
  validateRoute(
    zod.object({
      body: zod.object({
        productId: zod.string({ required_error: "Product id is required" }).nonempty(),
        value: zod.number({ required_error: "Value is required" }).min(0).max(5),
      }),
    }),
  ),
  async (req, res, next) => {
    try {
      const { dbClient, db, connectionConfig } = req;
      const body: Pick<Rating, "productId" | "value"> = req.body;
      const createdAt: Rating["createdAt"] = new Date().toString();

      const newRating: Rating = {
        id: new ObjectId().toString(),
        userId: connectionConfig.userId,
        productId: body.productId,
        value: body.value,
        createdAt,
        updatedAt: createdAt,
      };

      const rating = await db.collection("ratings").insertOne(newRating);

      res.status(200).json({ ...newRating, _id: rating.insertedId });

      const productRatings = await db.collection("ratings").find({ productId: body.productId }).toArray();
      const productVotes = productRatings.map(({ value }) => value);
      const newProductRating = Math.round(calcAverage(productVotes));

      db.collection("products").updateOne({ id: body.productId }, { $set: { rating: newProductRating } });
    } catch (error) {
      return next(error);
    }
  },
);
