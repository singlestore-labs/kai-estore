import express from "express";

import { connectionConfig } from "@/middlewares/connectionConfig";
import { dbConnection } from "@/middlewares/dbConnection";

import { connectionRouter } from "./connection";
import { dataRouter } from "./data";
import { userRouter } from "./user";
import { categoryRouter } from "./category";
import { tagRouter } from "./tag";
import { infoRouter } from "./info";
import { ratingRouter } from "./rating";
import { productRouter } from "./product";
import { orderRouter } from "./order";

const withConnectionRouter = express.Router();
withConnectionRouter.use(connectionConfig);
withConnectionRouter.use(dbConnection);

[
  dataRouter,
  userRouter,
  categoryRouter,
  tagRouter,
  ratingRouter,
  productRouter,
  orderRouter,
  infoRouter,
].forEach((route) => withConnectionRouter.use(route));

export const apiRouter = express.Router();
[connectionRouter, withConnectionRouter].forEach((route) => apiRouter.use(route));
