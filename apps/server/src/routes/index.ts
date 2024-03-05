import express from "express";

import { isConnectionConfigRequest } from "@/middlewares/isConnectionConfigRequest";
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
import { configRouter } from "@/routes/config";

const withConnectionRouter = express.Router();
withConnectionRouter.use(isConnectionConfigRequest);
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
  infoRouter
].forEach((route) => withConnectionRouter.use(route));

export const apiRouter = express.Router();
[configRouter, connectionRouter, withConnectionRouter].forEach((route) => apiRouter.use(route));
