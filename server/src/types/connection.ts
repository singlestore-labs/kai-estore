import { DBConfig } from "./db";
import { DatasetSizes } from "./data";

export type ConnectionConfig = DBConfig & {
  dataSize: DatasetSizes;
  userId: string;
};
