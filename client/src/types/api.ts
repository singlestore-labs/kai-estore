export type ConnectionConfig = {
  mongoURI: string;
  dbName: string;
  dataSize: string;
  shouldGenerateData?: boolean;
};

type Schema<T extends object = object> = T & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type User = Schema;

export type Category = Schema<{ name: string }>;

export type Tag = Schema<{ name: string }>;

export type Product = Schema<{
  name: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  category: Category;
  tags: Tag[];
}>;

export type Order = Schema<{
  userId: User["id"];
  productIds: Product["id"][];
}>;

export type Rating = Schema<{
  productId: Product["id"];
  userId: User["id"];
  value: number;
}>;

export type TopProduct = Pick<Product, "id" | "name" | "image"> & {
  sales: number;
};

export type TrendingProduct = Pick<Product, "id" | "name" | "image"> & {
  sales: number;
};

export type RecommProduct = Pick<Product, "id" | "name" | "image"> & {
  count: number;
};

export type SalesProduct = Pick<Product, "name"> & {
  count: number;
  day: string;
};

export type RelatedProduct = Pick<Product, "id" | "name" | "image" | "category" | "price"> & {
  count: number;
};

export type DbInfo = {
  dbStats: {
    avgObjectSize: number;
    collections: number;
    dataSize: number;
    db: string;
    indexSize: number;
    indexes: number;
    memoryUse: number;
    objects: number;
    ok: number;
    scaleFactor: number;
    storageSize: number;
    totalSize: number;
    views: number;
  };
  orderRecords: number;
  productsNumber: number;
  ratingsNumber: number;
};

export type WithDuration<T = any> = [result: T, ms: number, value: number, unit: string];
