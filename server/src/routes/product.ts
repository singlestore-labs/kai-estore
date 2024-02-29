import express from "express";
import { Db } from "mongodb";
import zod from "zod";
import subDays from "date-fns/subDays";

import { validateRoute } from "@/middlewares/validateRoute";
import { getTopProductsQuery } from "@/queries/getTopProducts";
import { getProductSalesQuery } from "@/queries/getProductSales";
import { getRelatedProductsQuery } from "@/queries/getRelatedProducts";
import { withDuration } from "@/utils/helpers";
import { getProductsQuery } from "@/queries/getProducts";

export const productRouter = express.Router();

const validateId = zod.object({ params: zod.object({ id: zod.string().nonempty().optional() }).optional() });
const validateNumber = zod.object({ query: zod.object({ number: zod.string().optional() }) });
const validateFrom = zod.object({
  query: zod.object({ from: zod.string().nonempty().optional() }).optional(),
});

async function getRandomProductId(db: Db) {
  return (
    await db
      .collection("products")
      .aggregate([{ $sample: { size: 1 } }, { $project: { _id: 0, id: 1 } }])
      .toArray()
  )[0].id;
}

productRouter.get("/product/:id", validateRoute(validateId), async (req, res, next) => {
  const { dbClient, db, params } = req;
  try {
    const id = params.id ?? (await getRandomProductId(db));
    const product = await withDuration(() => {
      return db
        .collection("products")
        .aggregate([
          { $match: { id } },
          {
            $lookup: {
              from: "categories",
              localField: "categoryId",
              foreignField: "id",
              as: "category",
            },
          },
          { $unwind: "$category" },
        ])
        .toArray();
    });

    return res.status(200).send(product[0]);
  } catch (error) {
    return next(error);
  }
});

productRouter.get(`/product/:id/sales`, validateRoute(validateId, validateFrom), async (req, res) => {
  const { db } = req;
  try {
    const query: { from?: string } = req.query;
    const id = req.params.id ?? (await getRandomProductId(db));
    const from = query.from ? new Date(query.from) : subDays(new Date(), 90);
    const sales = await withDuration(() => getProductSalesQuery(db, { productId: id, from }));

    return res.status(200).send(sales);
  } catch (error) {
    return res.status(200).send([]);
  }
});

productRouter.get(`/product/:id/related-products`, validateRoute(validateId), async (req, res) => {
  const { db } = req;
  try {
    const id = req.params.id ?? (await getRandomProductId(db));
    const products = await withDuration(() => getRelatedProductsQuery(db, { productId: id }));

    return res.status(200).send(products);
  } catch (error) {
    return res.status(200).send([]);
  }
});

productRouter.get("/products", async (req, res, next) => {
  const { db } = req;
  try {
    const products = await db.collection("products").find().toArray();

    return res.status(200).send(products);
  } catch (error) {
    return next(error);
  }
});

productRouter.get("/products/filter", async (req, res, next) => {
  const { db } = req;
  try {
    const products = await withDuration(() => getProductsQuery(db, req.query));

    return res.status(200).send(products);
  } catch (error) {
    return next(error);
  }
});

productRouter.get(`/products/prices`, async (req, res) => {
  const { db } = req;
  try {
    const prices = await db
      .collection("products")
      .aggregate([{ $group: { _id: null, values: { $addToSet: "$price" } } }])
      .toArray();

    return res.status(200).send(prices[0]?.values.sort());
  } catch (error) {
    return res.status(200).send([]);
  }
});

productRouter.get(`/products/ratings`, async (req, res) => {
  const { db } = req;
  try {
    const ratings = await db
      .collection("products")
      .aggregate([{ $group: { _id: null, values: { $addToSet: "$rating" } } }])
      .toArray();

    return res.status(200).send(ratings[0]?.values.sort());
  } catch (error) {
    return res.status(200).send([]);
  }
});

productRouter.get(`/products/top`, validateRoute(validateNumber), async (req, res) => {
  const { db } = req;
  try {
    const query: { number?: string } = req.query;
    const products = await withDuration(() => getTopProductsQuery(db, { number: query.number }));

    return res.status(200).send(products);
  } catch (error) {
    return res.status(200).send([]);
  }
});

productRouter.get(`/products/trending`, validateRoute(validateNumber, validateFrom), async (req, res) => {
  const { db } = req;
  try {
    const query: { from?: string; number?: string } = req.query;
    const from = query.from ? new Date(query.from) : subDays(new Date(), 90);
    const products = await withDuration(() => getTopProductsQuery(db, { from, number: query.number }));

    return res.status(200).send(products);
  } catch (error) {
    return res.status(200).send([]);
  }
});
