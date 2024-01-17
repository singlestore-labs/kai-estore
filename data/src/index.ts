import fs from "fs";
import { Types } from "mongoose";
import dateFns from "date-fns";
import omit from "lodash.omit";
import randomInt from "random-int";

import { Category, Dataset, Order, Product, Rating, Tag, User } from "./types";

import {
  createRandomIndexClosure,
  generateDuplicates,
  getDirname,
  getRandomDate,
  getUniqueFieldValues,
  processAsChunks,
  unwindObjects,
} from "./helpers";

let USERS_NUMBER = 1;
let PRODUCTS_NUMBER = 10;
let ORDERS_NUMBER = 10;
let DATASET_NAME = "dataset";

const args = process.argv.slice(2);

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--users" && i + 1 < args.length) {
    USERS_NUMBER = Number(args[i + 1]);
  } else if (args[i] === "--products" && i + 1 < args.length) {
    PRODUCTS_NUMBER = Number(args[i + 1]);
  } else if (args[i] === "--orders" && i + 1 < args.length) {
    ORDERS_NUMBER = Number(args[i + 1]);
  } else if (args[i] === "--name" && i + 1 < args.length) {
    DATASET_NAME = args[i + 1];
  }
}

const datasetPath = `${getDirname(import.meta.url)}/dataset.json`;
const dataset: Dataset = JSON.parse(fs.readFileSync(datasetPath, "utf-8"));
const datasetUniqueValues = getUniqueFieldValues(dataset.products);

function generateId() {
  return new Types.ObjectId().toString();
}

function createObject<T extends Record<any, any>>(object: T) {
  return { id: generateId(), createdAt: new Date(), updatedAt: new Date(), ...object };
}

function generateDates<T extends Record<any, any>>(object: T) {
  const createdAt = getRandomDate(dateFns.subDays(new Date(), 182), new Date());
  const updatedAt = getRandomDate(createdAt, new Date());
  return { ...object, createdAt, updatedAt };
}

function generateUsers(length = 1): User[] {
  return Array.from({ length }).map(() => generateDates(createObject({})));
}

function generateCategories(): Category[] {
  return datasetUniqueValues.category.map((name) => generateDates(createObject({ name })));
}

function generateTags(): Tag[] {
  return datasetUniqueValues.tags.map((name) => generateDates(createObject({ name })));
}

function generateProducts(categories: Category[], tags: Tag[], length = 1): Product[] {
  function generatePrice() {
    const step = 25;
    const price = randomInt(50, 300);
    return Math.ceil(price / step) * step;
  }

  function bindImage(productName: string) {
    return `/images/${productName}.png`;
  }

  const uniqueProducts: Product[] = dataset.products.map((product) => {
    return createObject({
      ...omit(product, ["category", "tags", "createdAt"]),
      rating: 0,
      price: generatePrice(),
      image: bindImage(product.name),
      categoryId: categories.find((category) => category.name === product.category)?.id ?? "",
      tagIds: product.tags.map((name) => tags.find((tag) => tag.name === name)?.id ?? ""),
    });
  });

  return generateDuplicates(uniqueProducts, length, (object) => {
    return generateDates({ ...object, id: generateId(), price: generatePrice() });
  });
}

function generateOrders(users: User[], products: Product[], length = 1): Order[] {
  const uniqueOrdersLength: number = (() => {
    const ordersLength = Math.round(length / 10);
    return ordersLength <= length && ordersLength >= 5 ? ordersLength : Math.round(length / 2);
  })();

  const uniqueOrders: Order[] = Array.from({
    length: uniqueOrdersLength,
  }).map(() => {
    const userId = users[randomInt(0, users.length - 1)].id;
    const getRandomIndex = createRandomIndexClosure(products.length);
    const productIds = Array.from({ length: randomInt(1, 10) }).map(() => products[getRandomIndex()].id);
    return createObject({ itemId: "", userId, productIds });
  });

  return generateDuplicates(uniqueOrders, length, (object) => {
    return generateDates({ ...object, id: generateId(), itemId: generateId() });
  });
}

function generateRatings(users: User[], products: Product[]): Rating[] {
  const ratings: Rating[] = [];
  const targetCount = users.length * products.length;

  for (const user of users) {
    for (const product of products) {
      ratings.push(
        generateDates(
          createObject({
            userId: user.id,
            productId: product.id,
            value: randomInt(0, 5),
          }),
        ),
      );

      process.stdout.write(
        `\r${ratings.length}/${targetCount} generated${ratings.length === targetCount ? "\n" : ""}`,
      );
    }
  }

  return ratings;
}

function assignProductRatings(products: Product[], ratings: Rating[]) {
  const ratingsMap = ratings.reduce<Record<Product["id"], Product["rating"][]>>((acc, rating) => {
    if (!acc[rating.productId]) {
      acc[rating.productId] = [];
    }
    acc[rating.productId].push(rating.value);
    return acc;
  }, {});

  for (const [i, product] of products.entries()) {
    if (ratingsMap[product.id]) {
      const total = ratingsMap[product.id].reduce((sum, current) => sum + current, 0);
      const count = ratingsMap[product.id].length;
      product.rating = Math.round(total / count);
    }

    process.stdout.write(`\r${i + 1}/${products.length} assigned${i === products.length - 1 ? "\n" : ""}`);
  }
}

async function writeToFile(name: string, data: any[]) {
  return new Promise((resolve, reject) => {
    const path = `export/${DATASET_NAME}-${name}.json`;
    const stream = fs.createWriteStream(path);

    stream.once("open", () => {
      console.log(`Writting: ${path}`);
      stream.write("[\n");
      data.forEach((record, i) => {
        if (i > 0) stream.write(",\n");
        stream.write(JSON.stringify(record, null, 2));
      });
      stream.write("\n]");
      stream.end();
    });

    stream.on("finish", () => {
      resolve("Done");
    });

    stream.on("error", (err) => {
      reject(err);
    });
  });
}

async function writeToFileWithChunks(
  name: string,
  data: any[],
  options?: { maxLength?: number; lastFileIndex?: number },
) {
  const { maxLength = 250_000, lastFileIndex = 1 } = options ?? {};

  if (data.length <= maxLength) {
    await writeToFile(name, data);
  } else {
    let _lastFileIndex = lastFileIndex;

    await processAsChunks(
      data,
      async (chunk) => {
        await writeToFile(`${name}-${_lastFileIndex}`, chunk);
        _lastFileIndex++;
      },
      maxLength,
    );

    return _lastFileIndex;
  }
}

async function generateData() {
  console.log("Generating users");
  const users = generateUsers(USERS_NUMBER);

  console.log("Generating categories");
  let categories = generateCategories();

  console.log("Generating tags");
  let tags = generateTags();

  await Promise.all([
    writeToFileWithChunks("users", users),
    writeToFile("categories", categories),
    writeToFile("tags", tags),
  ]);

  console.log("Generating products");
  let products = generateProducts(categories, tags, PRODUCTS_NUMBER);

  console.log("Generating ratings");
  let ratings = generateRatings(users, products);

  console.log("Assigning product ratings");
  assignProductRatings(products, ratings);

  await writeToFileWithChunks("products", products);
  await writeToFileWithChunks("ratings", ratings);

  categories = [];
  tags = [];
  ratings = [];

  console.log("Generating ordres");
  const orders = generateOrders(users, products, ORDERS_NUMBER);

  products = [];

  let lastFileIndex = 1;
  processAsChunks(
    orders,
    async (chunk) => {
      const unwoundOrders = unwindObjects(chunk, (object: (typeof orders)[number]) => {
        object.itemId = object.itemId ?? object.id ?? generateId();
        object.id = generateId();
        (object as Record<any, any>).productId = object.productIds;
        delete (object as Record<any, any>).productIds;

        return object;
      });

      lastFileIndex =
        (await writeToFileWithChunks(`orders`, unwoundOrders, { lastFileIndex })) ?? lastFileIndex;
    },
    250_000,
  );
}

await generateData();
