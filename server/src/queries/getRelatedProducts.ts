import { Db } from "mongodb";

import { Pipeline } from "@/types/db";

export async function getRelatedProductsQuery(db: Db, filter: { productId: string }) {
  const { productId } = filter;

  const product = (
    await db
      .collection("products")
      .aggregate([{ $match: { id: productId } }])
      .toArray()
  )?.[0];

  const pipeline: Pipeline = [
    { $match: { id: { $ne: productId }, name: { $ne: product.name }, tagIds: { $in: product.tagIds } } },
    { $limit: 5 },
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "id",
        as: "category",
      },
    },

    { $unwind: "$category" },
  ];

  return await db.collection("products").aggregate(pipeline).toArray();
}
