import { Db, MongoClient } from "mongodb";
import { ConnectionConfig } from "./connection";

export {};

declare global {
  namespace Express {
    export interface Request {
      connectionConfig: ConnectionConfig;
      dbClient: MongoClient;
      db: Db;
    }
  }
}