import express from "express";

export const infoRouter = express.Router();

infoRouter.get("/info", async (req, res, next) => {
  const { db, dbClient } = req;
  try {
    const [dbStats, ordersNumber, productsNumber, ratingsNumber] = await Promise.all([
      db.stats(),
      db.collection("orders").countDocuments(),
      db.collection("products").countDocuments(),
      db.collection("ratings").countDocuments()
    ]);
    await dbClient.close();
    return res.status(200).json({ dbStats, ordersNumber, productsNumber, ratingsNumber });
  } catch (error) {
    await dbClient.close();
    return next(error);
  }
});
