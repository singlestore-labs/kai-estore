import express from "express";

export const categoryRouter = express.Router();

categoryRouter.get("/categories", async (req, res, next) => {
  const { db } = req;
  try {
    const categories = await db.collection("categories").find().toArray();

    return res.status(200).send(categories);
  } catch (error) {
    return next(error);
  }
});
