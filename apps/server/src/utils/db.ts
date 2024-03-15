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

  const client = new MongoClient(config.mongoURI);
  await client.connect();
  const db = client.db(config.dbName);

  return { client, db } as const;
}

export async function createDBConnection(config?: ConnectionConfig) {
  let retries = 0;

  function connect() {
    try {
      if (!config?.mongoURI || !config.dbName) return sourceDBConnection;
      return connectDB({ mongoURI: config.mongoURI, dbName: config.dbName });
    } catch (error) {
      console.error(error);
      if (retries < 5) {
        retries++;
        return connect();
      }
    }
  }

  return connect();
}
