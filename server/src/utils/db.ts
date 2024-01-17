import { MongoClient } from "mongodb";

import { DBConfig } from "@/types/db";
import { ConnectionConfig } from "@/types/connection";

export async function connectDB(config: DBConfig) {
  if (!config.mongoURI) {
    throw new Error("Mongo URI is undefined");
  }

  if (!config.dbName) {
    throw new Error("Database name is undefined");
  }

  const client = new MongoClient(config.mongoURI);
  await client.connect();
  const db = client.db(config.dbName);

  return { client, db };
}

export function createDBConnection(config?: ConnectionConfig) {
  if (!config) {
    throw new Error("Connection config is undefined");
  }

  const { mongoURI, dbName } = config;

  if (!mongoURI) {
    throw new Error("Mongo URI is undefined");
  }

  if (!dbName) {
    throw new Error("Database name is undefined");
  }

  return connectDB({ mongoURI, dbName });
}
