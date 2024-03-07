import fs from "fs";
import { Db, ObjectId } from "mongodb";

import { Dataset, DatasetCollectionNames, DatasetSizes, Order, OrderFlat, User } from "@/types/data";
import { ConnectionConfig } from "@/types/connection";

import { getDirname } from "./helpers";

export async function validateData(
  db: Db,
  dataSize?: ConnectionConfig["dataSize"],
  withCDC?: ConnectionConfig["withCDC"]
) {
  try {
    const existedCollectionNames = (await db.listCollections().toArray()).map(({ name }) => name);
    const meta = (await db.collection("meta").find().toArray())[0] ?? {};
    const requiredCollectionNames = ["categories", "orders", "products", "ratings", "tags", "users"];
    let isDataValid = true;

    if (withCDC) {
      return !!meta.cdcStatus;
    }

    for await (const requiredCollectionName of requiredCollectionNames) {
      isDataValid = existedCollectionNames.includes(requiredCollectionName);
      isDataValid = Boolean(await db.collection(requiredCollectionName).countDocuments());
      if (!isDataValid) break;
    }

    if (dataSize) {
      const isDataSizeValid = meta.dataSize === dataSize;
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
