import express from "express";

export const infoRouter = express.Router();

infoRouter.get("/info", async (req, res, next) => {
  try {
    const { db } = req;

    const [dbStats, orderRecords, productsNumber, ratingsNumber] = await Promise.all([
      db.stats(),
      db.collection("orders").countDocuments(),
      db.collection("products").countDocuments(),
      db.collection("ratings").countDocuments(),
    ]);

    return res.status(200).json({ dbStats, orderRecords, productsNumber, ratingsNumber });
  } catch (error) {
    return next(error);
  }
});
