import { Db } from "mongodb";

import { Match, Pipeline } from "@/types/db";

export async function getProductSalesQuery(db: Db, filter: { productId: string; from?: Date | string }) {
  const { productId, from } = filter;

  const $match: Match = { productId };

  if (from) {
    $match.createdAt = { $gte: from };
  }

  const pipeline: Pipeline = [
    { $match },
    {
      $group: {
        _id: {
          product: "$productId",
          day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
        },
        count: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: "products",
        localField: "_id.product",
        foreignField: "id",
        as: "product_info"
      }
    },
    {
      $unwind: "$product_info"
    },
    {
      $project: {
        _id: "$_id.product",
        name: "$product_info.name",
        day: "$_id.day",
        count: "$count"
      }
    },
    { $sort: { day: 1 } }
  ];

  return await db.collection("orders").aggregate(pipeline).toArray();
}
