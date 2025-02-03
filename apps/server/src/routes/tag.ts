import express from "express";

export const tagRouter = express.Router();

tagRouter.get("/tags", async (req, res, next) => {
  const { db, dbClient } = req;
  try {
    const tags = await db.collection("tags").find().toArray();
    await dbClient.close();
    return res.status(200).send(tags);
  } catch (error) {
    await dbClient.close();
    return next(error);
  }
});
