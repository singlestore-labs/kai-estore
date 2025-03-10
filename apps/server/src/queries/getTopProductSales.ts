import { Db } from "mongodb";

import { Pipeline } from "@/types/db";

export async function getTopProductSalesQuery(db: Db) {
  let pipeline: Pipeline = [
    { $group: { _id: "$productId", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "id",
        as: "product_info"
      }
    },
    { $unwind: "$product_info" },
    {
      $group: {
        _id: "$_id",
        id: { $first: "$product_info.id" },
        name: { $first: "$product_info.name" },
        image: { $first: "$product_info.image" },
        sales: { $first: "$count" }
      }
    },
    {
      $project: {
        _id: 0,
        id: 1,
        name: 1,
        image: 1,
        sales: 1
      }
    },
    { $sort: { sales: -1 } },
    { $limit: 1 }
  ];

  const topProdcut = (await db.collection("orders").aggregate(pipeline).toArray())[0];

  pipeline = [
    { $match: { productId: topProdcut.id } },
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
