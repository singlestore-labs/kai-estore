import { MongoClient } from "mongodb";

import { DBConfig } from "@/types/db";
import { ConnectionConfig } from "@/types/connection";
import { DB_NAME, DB_URI } from "@/constants/env";

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
  return connectDB({
    mongoURI: config?.mongoURI || DB_URI,
    dbName: config?.dbName || DB_NAME
  });
}
