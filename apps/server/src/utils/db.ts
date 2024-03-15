import { MongoClient } from "mongodb";

import { DBConfig } from "@/types/db";
import { ConnectionConfig } from "@/types/connection";
import { DB_NAME, DB_URI } from "@/constants/env";

const sourceDBConnection = connectDB({ mongoURI: DB_URI, dbName: DB_NAME });

export async function connectDB(config: DBConfig) {
  if (!config.mongoURI) {
    throw new Error("Mongo URI is undefined");
  }

  if (!config.dbName) {
    throw new Error("Database name is undefined");
  }

  const client = new MongoClient(config.mongoURI, {
    tls: true,
    socketTimeoutMS: 300000,
    connectTimeoutMS: 300000,
    maxPoolSize: 10000,
    maxConnecting: 10000
  });

  await client.connect();

  const db = client.db(config.dbName);

  return { client, db };
}

export function createDBConnection(config?: ConnectionConfig) {
  if (config?.mongoURI && config?.dbName) {
    return connectDB({ mongoURI: config.mongoURI, dbName: config.dbName });
  }

  return sourceDBConnection;
}
