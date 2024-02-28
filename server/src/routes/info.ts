import express from "express";

export const infoRouter = express.Router();

infoRouter.get("/info", async (req, res, next) => {
  try {
    const { dbClient, db } = req;

    const [dbStats, orderRecords, productsNumber, ratingsNumber] = await Promise.all([
      db.stats(),
      db.collection("orders").countDocuments(),
      db.collection("products").countDocuments(),
      db.collection("ratings").countDocuments(),
    ]);

    dbClient.close();

    return res.status(200).json({ dbStats, orderRecords, productsNumber, ratingsNumber });
  } catch (error) {
    return next(error);
  }
});
