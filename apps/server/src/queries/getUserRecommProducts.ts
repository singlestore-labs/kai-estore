import { Db } from "mongodb";

import { User } from "@/types/data";

export async function getUserRecommProductsQuery(db: Db, userId: User["id"]) {
  const userActionProducts = await db
    .collection("ratings")
    .aggregate([
      // Union of two aggregations using $facet
      {
        $facet: {
          // Aggregation 1: Find all products with ratings above 4
          productsWithHighRatings: [
            { $match: { $and: [{ value: { $gt: 4 } }, { userId }] } },
            { $group: { _id: "$productId" } }
          ],

          // Aggregation 2: Find all products purchased by a specific user
          productsPurchasedByUser: [{ $match: { userId } }, { $group: { _id: "$productId" } }]
        }
      },

      // Merge the results of the two aggregations using $setUnion
      {
        $project: { products: { $concatArrays: ["$productsWithHighRatings", "$productsPurchasedByUser"] } }
      },
      { $unwind: "$products" },

      // Exclude the _id field and keep only the product field
      { $project: { _id: 0, id: "$products._id" } },
      { $limit: 5 }
    ])
    .toArray();

  const productIds = userActionProducts.map(({ id }) => id);

  return await db
    .collection("orders")
    .aggregate([
      { $match: { productId: { $in: productIds } } },
      // Count the occurrences of each product
      { $group: { _id: "$itemId", productCount: { $sum: 1 } } },
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "itemId",
          as: "orders"
        }
      },
      { $unwind: "$orders" },
      { $match: { "orders.productId": { $nin: productIds } } },
      // Count the occurrences of each productId after $unwind
      { $group: { _id: "$orders.productId", count: { $sum: 1 } } },
      // Sort in descending order by count
      { $sort: { count: -1 } },
      { $limit: 5 },

      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "id",
          as: "details"
        }
      },

      { $unwind: "$details" },

      {
        $project: {
          _id: 0,
          id: "$details.id",
          name: "$details.name",
          image: "$details.image",
          count: 1
        }
      }
    ])
    .toArray();
}
