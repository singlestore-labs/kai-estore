import { Response } from "express";

import { ConnectionConfig } from "@/types/connection";
import { decrypt, encrypt } from "./crypto";

export function setResponseConnectionConfigHeader(res: Response, config: ConnectionConfig) {
  res.setHeader("Access-Control-Expose-Headers", "x-connection-config");
  res.setHeader("x-connection-config", encrypt(config));
}

export function parseConnectionConfigHeader(headers: Record<any, any>): ConnectionConfig {
  const connectionConfig = headers["x-connection-config"];

  if (!connectionConfig) {
    throw new Error("Connection config header is undefined", { cause: "CONNECTION_CONFIG" });
  }

  const config = JSON.parse(decrypt(connectionConfig));

  if (!config) {
    throw new Error("Connection config value is invalid", { cause: "CONNECTION_CONFIG" });
  }

  return config;
}
