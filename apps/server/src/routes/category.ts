import express from "express";

export const categoryRouter = express.Router();

categoryRouter.get("/categories", async (req, res, next) => {
  const { db, dbClient } = req;
  try {
    const categories = await db.collection("categories").find().toArray();
    await dbClient.close();
    return res.status(200).send(categories);
  } catch (error) {
    await dbClient.close();
    return next(error);
  }
});
