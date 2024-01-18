import express from "express";

import * as env from "@/constants/env";

export const configRouter = express.Router();

configRouter.get("/config", async (req, res, next) => {
  try {
    const { DB_URI, ...rest } = env;
    return res.status(200).json(rest);
  } catch (error) {
    return next(error);
  }
});
