import "dotenv/config";

export const PORT = Number(process.env.SERVER_PORT);
export const ORIGINS = (process.env.SERVER_ORIGINS ?? "").split(",");
export const MONGO_URI = process.env.SERVER_MONGO_URI ?? "";
export const DB_NAME = process.env.SERVER_DB_NAME ?? "";
export const DATA_SIZE = "";
export const CRYPTO_SECRET = process.env.SERVER_CRYPTO_SECRET ?? "";
export const IS_SINGLE_DB = false;
