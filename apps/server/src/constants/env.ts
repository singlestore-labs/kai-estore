import "dotenv/config";

export const PORT = Number(process.env.SERVER_PORT) || Number(process.env.PORT);
export const ORIGINS = (process.env.SERVER_ORIGINS ?? "").split(",");
export const DB_URI = process.env.SERVER_DB_URI ?? "";
export const DB_NAME = process.env.SERVER_DB_NAME ?? "";
export const DATA_SIZE = process.env.SERVER_DATA_SIZE ?? "";
export const CRYPTO_SECRET = process.env.SERVER_CRYPTO_SECRET ?? "";
export const IS_SINGLE_DB = process.env.IS_SINGLE_DB === "true";
