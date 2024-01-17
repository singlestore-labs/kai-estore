import express from "express";
import http from "http";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from "path";

import { errorHandler } from "@/middlewares/errorHandler";
import { processEnv } from "@/utils/env";
import { getDirname } from "@/utils/helpers";
import { apiRouter } from "./routes";
import { initSocket } from "./services/socket";
import { socketEventsHandler } from "./events";

const { ORIGINS, PORT } = processEnv();

const app = express();
const server = http.createServer(app);

app.use(morgan("dev"));
app.use(cors({ origin: ORIGINS, credentials: true }));
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use("/images", express.static(path.join(getDirname(import.meta.url), "data/images")));
app.use("/api", apiRouter);

initSocket(
  server,
  () => {
    server.listen(PORT, () => {
      console.log(`Server started on port: ${PORT}`);
      app.use(errorHandler);
    });
  },
  socketEventsHandler,
);
