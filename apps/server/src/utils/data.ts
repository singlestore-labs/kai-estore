import fs from "fs";
import { Db, ObjectId } from "mongodb";

import { CDC, Dataset, DatasetCollectionNames, DatasetSizes, Meta, Order, OrderFlat, User } from "@/types/data";
import { ConnectionConfig } from "@/types/connection";

import { getDirname } from "./helpers";
import { REQUIRED_COLLECTION_NAMES } from "@/constants/db";

export async function validateData(
  db: Db,
  dataSize?: ConnectionConfig["dataSize"],
  withCDC?: ConnectionConfig["withCDC"]
) {
  try {
    if (withCDC) {
      const cdc = (await db.collection<CDC>("cdc").findOne()) || undefined;
      return !!cdc?.status;
    }

    const existedCollectionNames = (await db.listCollections().toArray()).map(({ name }) => name);
    let isDataValid = true;

    for await (const collectionName of REQUIRED_COLLECTION_NAMES) {
      isDataValid = existedCollectionNames.includes(collectionName);
      isDataValid = Boolean(await db.collection(collectionName).countDocuments());
      if (!isDataValid) break;
    }

    if (dataSize) {
      const meta = (await db.collection<Meta>("meta").findOne()) || undefined;
      const isDataSizeValid = meta?.dataSize === dataSize;
      isDataValid = isDataValid && isDataSizeValid;
    }

    return isDataValid;
  } catch (error) {
    return false;
  }
}

export async function processDatasetFiles<T extends DatasetCollectionNames>(
  collectionName: T,
  size: DatasetSizes,
  onData: (data: Dataset[T]) => Promise<void>
) {
  const dirPath = `${getDirname(import.meta.url)}/../data/dataset-${size}`;
  const fileNames = await fs.promises.readdir(dirPath);
  const collectionFileNames = fileNames.filter((path) => {
    return path.startsWith(`dataset-${size}-${collectionName}`);
  });

  for await (const fileName of collectionFileNames) {
    const fileContent = await fs.promises.readFile(`${dirPath}/${fileName}`, "utf-8");
    const dataset = JSON.parse(fileContent) as Dataset[T];
    await onData(dataset);
  }
}

export function createUser(): User {
  const createdAt = new Date().toString();

  return {
    id: new ObjectId().toString(),
    createdAt,
    updatedAt: createdAt
  };
}

export function createFlatOrders(userId: Order["userId"], prodcutIds: Order["productIds"]): OrderFlat[] {
  const itemId = new ObjectId().toString();
  const createdAt = new Date();

  return prodcutIds.map((productId) => ({
    id: new ObjectId().toString(),
    itemId,
    productId,
    userId,
    createdAt,
    updatedAt: createdAt
  }));
}
