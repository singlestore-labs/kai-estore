import crypto from "crypto-js";

import { processEnv } from "./env";

const { CRYPTO_SECRET } = processEnv();

export function encrypt(value: string | number | object) {
  let _value = typeof value === "string" ? value : "";

  if (typeof value === "object") {
    _value = JSON.stringify(value);
  }

  if (typeof value === "number") {
    _value = value.toString();
  }

  return crypto.AES.encrypt(_value, CRYPTO_SECRET).toString();
}

export function decrypt(value: string) {
  return crypto.AES.decrypt(value, CRYPTO_SECRET).toString(crypto.enc.Utf8);
}
