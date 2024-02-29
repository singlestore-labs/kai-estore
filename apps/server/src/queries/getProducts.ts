import { Db } from "mongodb";

import { Pipeline } from "@/types/db";
import { Category, Tag } from "@/types/data";

export async function getProductsQuery(
  db: Db,
  filter: {
    category?: Category["id"][];
    tag?: Tag["id"][];
    price?: string[];
    rating?: string[];
    sort?: "date" | "sales" | "price-asc" | "price-desc";
    page?: string;
    perPage?: number;
  }
) {
  const perPage = filter.perPage ?? 12;
  const page = Number(filter.page ?? 1);
  const pipeline: Pipeline = [];
  const $and: Pipeline = [];

  if (filter.category?.length) {
    $and.push({ categoryId: { $in: filter.category } });
  }

  if (filter.tag?.length) {
    $and.push({ tagId: { $in: filter.tag } });
  }

  if (filter.price?.length) {
    const _$or: Pipeline = [];

    for (const range of filter.price) {
      const [from, to] = range.split("-").map(Number);
      _$or.push({ price: { $gte: from, $lte: to } });
    }

    if (_$or.length) {
      $and.push({ $or: _$or });
    }
  }

  if (filter.rating?.length) {
    $and.push({ rating: { $in: filter.rating.map(Number) } });
  }

  if ($and.length) {
    pipeline.push({ $match: { $and } });
  }

  const { total } =
    (
      await db
        .collection("products")
        .aggregate([...pipeline, { $count: "total" }])
        .toArray()
    )[0] ?? {};

  if (filter.sort) {
    const [field, direction] = filter.sort.split(":");
    pipeline.push({ $sort: { [field]: Number(direction) } as Record<string, 1 | -1> });
  }

  if (total > perPage) {
    pipeline.push({ $skip: (page - 1) * perPage });
  }

  pipeline.push({ $limit: perPage });

  pipeline.push({
    $lookup: {
      from: "categories",
      localField: "categoryId",
      foreignField: "id",
      as: "category"
    }
  });

  pipeline.push({ $unwind: "$category" });

  const products = await db.collection("products").aggregate(pipeline).toArray();

  return { products, total };
}
