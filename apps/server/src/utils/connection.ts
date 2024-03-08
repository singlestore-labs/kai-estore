import { Request, Response } from "express";

import { ConnectionConfig } from "@/types/connection";
import { decrypt, encrypt } from "./crypto";
import { DatasetSizes } from "@/types/data";

export function setResponseConnectionConfigHeader(res: Response, config: ConnectionConfig) {
  res.setHeader("Access-Control-Expose-Headers", "x-connection-config");
  res.setHeader("x-connection-config", encrypt(config));
}

export function parseConnectionConfigHeader(req: Request): ConnectionConfig {
  if (!req.isConnectionConfigRequest && !["/user"].includes(req.url)) {
    return { mongoURI: "", dbName: "", userId: "", dataSize: "" as DatasetSizes };
  }

  const connectionConfig = req.headers["x-connection-config"] as string | undefined;

  if (!connectionConfig) {
    throw new Error("Connection config header is undefined", { cause: "CONNECTION_CONFIG" });
  }

  const config = JSON.parse(decrypt(connectionConfig));

  if (!config) {
    throw new Error("Connection config value is invalid", { cause: "CONNECTION_CONFIG" });
  }

  return config;
}
