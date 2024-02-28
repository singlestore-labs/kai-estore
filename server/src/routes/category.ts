import express from "express";

export const categoryRouter = express.Router();

categoryRouter.get("/categories", async (req, res, next) => {
  try {
    const { dbClient, db } = req;
    const categories = await db.collection("categories").find().toArray();
    dbClient.close();
    return res.status(200).send(categories);
  } catch (error) {
    return next(error);
  }
});
