import { Response } from "express";
import { parse } from "cookie";

import { ConnectionConfig } from "@/types/connection";
import { decrypt, encrypt } from "./crypto";

export function setResponseConnectionConfigCookie(res: Response, config: ConnectionConfig) {
  res.cookie("connectionConfig", encrypt(config), { maxAge: 259200000, httpOnly: true });
}

export function parseConnectionConfigCookie(cookies?: string | object): ConnectionConfig {
  if (!cookies) {
    throw new Error("Cookies undefined");
  }

  let _cookies = cookies;

  if (typeof _cookies === "string") {
    _cookies = parse(_cookies);
  }

  const { connectionConfig } = _cookies as { connectionConfig: string } & { [K: PropertyKey]: any };

  if (!connectionConfig) {
    throw new Error("Connection config cookie is undefined", { cause: "CONNECTION_CONFIG" });
  }

  const config = JSON.parse(decrypt(connectionConfig));

  if (!config) {
    throw new Error("Connection config value is invalid", { cause: "CONNECTION_CONFIG" });
  }

  return config;
}
