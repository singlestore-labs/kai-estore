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
import { cdcRouter } from "@/routes/cdc";

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
  cdcRouter
].forEach((route) => withConnectionRouter.use(route));

export const apiRouter = express.Router();
apiRouter.use(isConnectionConfigRequest);
[configRouter, connectionRouter, withConnectionRouter].forEach((route) => apiRouter.use(route));
