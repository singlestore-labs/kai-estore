import { createDBConnection } from "@/utils/db";
import { Db } from "mongodb";

export async function cdcDataInfo(db: Db) {
  const requiredCollectionNames = ["categories", "orders", "products", "ratings", "tags", "users"];
  const { db: sourceDB } = await createDBConnection();
  const collectionsCount = await Promise.all(
    [db, sourceDB].map((db) => {
      return Promise.all(
        requiredCollectionNames.map(async (collection) => {
          return [collection, await db.collection(collection).countDocuments()] as const;
        })
      );
    })
  );

  return {
    collectionsCount,
    isReady: areArraysEqual(...collectionsCount.map((db) => db.map((i) => i[1])))
  } as const;
}

function areArraysEqual<T extends any[][] = any[][]>(...arrays: T): boolean {
  if (arrays.length <= 1) return true;
  const referencedArray = arrays[0];

  for (let array of arrays.slice(1)) {
    if (array.length !== referencedArray.length) {
      return false;
    }

    for (const [i, item] of array.entries())
      if (item !== referencedArray[i]) {
        return false;
      }
  }

  return true;
}
