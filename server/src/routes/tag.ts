import express from "express";

export const tagRouter = express.Router();

tagRouter.get("/tags", async (req, res, next) => {
  try {
    const { db } = req;
    const tags = await db.collection("tags").find().toArray();

    return res.status(200).send(tags);
  } catch (error) {
    return next(error);
  }
});
