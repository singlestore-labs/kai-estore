import { Db } from "mongodb";

import { Match, Pipeline } from "@/types/db";

export async function getTopProductsQuery(
  db: Db,
  filter?: { from?: Date | string; number?: number | string },
) {
  const { from, number } = filter ?? {};
  const $match: Match = {};

  if (from) {
    $match.createdAt = { $gte: from };
  }

  const pipeline: Pipeline = [
    { $match },
    { $group: { _id: "$productId", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "id",
        as: "product_info",
      },
    },
    { $unwind: "$product_info" },
    {
      $group: {
        _id: "$_id",
        id: { $first: "$product_info.id" },
        name: { $first: "$product_info.name" },
        image: { $first: "$product_info.image" },
        sales: { $first: "$count" },
      },
    },
    {
      $project: {
        _id: 0,
        id: 1,
        name: 1,
        image: 1,
        sales: 1,
      },
    },
    { $sort: { sales: -1 } },
  ];

  if (number) {
    pipeline.push({ $limit: Number(number) });
  }

  return await db.collection("orders").aggregate(pipeline).toArray();
}
