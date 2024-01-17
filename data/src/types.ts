export type DatasetProduct = {
  name: string;
  description: string;
  image: "";
  price: number;
  category: string;
  tags: Array<string>;
  createdAt: string;
  updatedAt: string;
};

export type Dataset = {
  products: DatasetProduct[];
};

export type Entity<T extends object = object> = T & {
  id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type User = Entity;

export type Category = Entity<{ name: string }>;

export type Tag = Entity<{ name: string }>;

export type Product = Entity<{
  name: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  categoryId: Category["id"];
  tagIds: Tag["id"][];
}>;

export type Order = Entity<{
  itemId: string;
  userId: User["id"];
  productIds: Product["id"][];
}>;

export type OrderFlat = Omit<Order, "products"> & { productId: Product["id"] };

export type Rating = Entity<{
  productId: Product["id"];
  userId: User["id"];
  value: number;
}>;

export type Data = {
  users: User[];
  categories: Category[];
  tags: Tag[];
  products: Product[];
  orders: OrderFlat[];
  ratings: Rating[];
};
