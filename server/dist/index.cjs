'use strict';

var express12 = require('express');
var http = require('http');
var morgan = require('morgan');
var cors = require('cors');
var helmet = require('helmet');
var cookieParser = require('cookie-parser');
var path = require('path');
var jwt = require('jsonwebtoken');
var zod4 = require('zod');
require('dotenv/config');
var url = require('url');
var differenceInMilliseconds = require('date-fns/differenceInMilliseconds');
var humanizeDuration = require('humanize-duration');
var crypto = require('crypto-js');
var mongodb = require('mongodb');
var fs = require('fs');
var subDays = require('date-fns/subDays');
var socket_io = require('socket.io');

var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var express12__default = /*#__PURE__*/_interopDefault(express12);
var http__default = /*#__PURE__*/_interopDefault(http);
var morgan__default = /*#__PURE__*/_interopDefault(morgan);
var cors__default = /*#__PURE__*/_interopDefault(cors);
var helmet__default = /*#__PURE__*/_interopDefault(helmet);
var cookieParser__default = /*#__PURE__*/_interopDefault(cookieParser);
var path__default = /*#__PURE__*/_interopDefault(path);
var jwt__default = /*#__PURE__*/_interopDefault(jwt);
var zod4__default = /*#__PURE__*/_interopDefault(zod4);
var differenceInMilliseconds__default = /*#__PURE__*/_interopDefault(differenceInMilliseconds);
var humanizeDuration__default = /*#__PURE__*/_interopDefault(humanizeDuration);
var crypto__default = /*#__PURE__*/_interopDefault(crypto);
var fs__default = /*#__PURE__*/_interopDefault(fs);
var subDays__default = /*#__PURE__*/_interopDefault(subDays);

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/cookie/index.js
var require_cookie = __commonJS({
  "node_modules/cookie/index.js"(exports) {
    exports.parse = parse2;
    exports.serialize = serialize;
    var decode = decodeURIComponent;
    var encode = encodeURIComponent;
    var pairSplitRegExp = /; */;
    var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
    function parse2(str, options) {
      if (typeof str !== "string") {
        throw new TypeError("argument str must be a string");
      }
      var obj = {};
      var opt = options || {};
      var pairs = str.split(pairSplitRegExp);
      var dec = opt.decode || decode;
      for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i];
        var eq_idx = pair.indexOf("=");
        if (eq_idx < 0) {
          continue;
        }
        var key = pair.substr(0, eq_idx).trim();
        var val = pair.substr(++eq_idx, pair.length).trim();
        if ('"' == val[0]) {
          val = val.slice(1, -1);
        }
        if (void 0 == obj[key]) {
          obj[key] = tryDecode(val, dec);
        }
      }
      return obj;
    }
    function serialize(name, val, options) {
      var opt = options || {};
      var enc = opt.encode || encode;
      if (typeof enc !== "function") {
        throw new TypeError("option encode is invalid");
      }
      if (!fieldContentRegExp.test(name)) {
        throw new TypeError("argument name is invalid");
      }
      var value = enc(val);
      if (value && !fieldContentRegExp.test(value)) {
        throw new TypeError("argument val is invalid");
      }
      var str = name + "=" + value;
      if (null != opt.maxAge) {
        var maxAge = opt.maxAge - 0;
        if (isNaN(maxAge) || !isFinite(maxAge)) {
          throw new TypeError("option maxAge is invalid");
        }
        str += "; Max-Age=" + Math.floor(maxAge);
      }
      if (opt.domain) {
        if (!fieldContentRegExp.test(opt.domain)) {
          throw new TypeError("option domain is invalid");
        }
        str += "; Domain=" + opt.domain;
      }
      if (opt.path) {
        if (!fieldContentRegExp.test(opt.path)) {
          throw new TypeError("option path is invalid");
        }
        str += "; Path=" + opt.path;
      }
      if (opt.expires) {
        if (typeof opt.expires.toUTCString !== "function") {
          throw new TypeError("option expires is invalid");
        }
        str += "; Expires=" + opt.expires.toUTCString();
      }
      if (opt.httpOnly) {
        str += "; HttpOnly";
      }
      if (opt.secure) {
        str += "; Secure";
      }
      if (opt.sameSite) {
        var sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
        switch (sameSite) {
          case true:
            str += "; SameSite=Strict";
            break;
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError("option sameSite is invalid");
        }
      }
      return str;
    }
    function tryDecode(str, decode2) {
      try {
        return decode2(str);
      } catch (e) {
        return str;
      }
    }
  }
});
var errorHandler = async (error, req, res, next) => {
  if (error.status === 401 || error instanceof jwt__default.default.TokenExpiredError) {
    return res.status(401).json({ error: error.message });
  }
  if (typeof error === "string") {
    return res.status(400).json({ error });
  }
  if (error instanceof zod4.ZodError) {
    return res.status(400).json({ error: error.errors });
  }
  if (error instanceof Error) {
    return res.status(500).json({ error: error.message, cause: error.cause });
  }
  return res.status(500).json(error);
};

// src/constants/env.ts
var env_exports = {};
__export(env_exports, {
  CRYPTO_SECRET: () => CRYPTO_SECRET,
  DATA_SIZE: () => DATA_SIZE,
  DB_NAME: () => DB_NAME,
  DB_URI: () => DB_URI,
  IS_SINGLE_DB: () => IS_SINGLE_DB,
  ORIGINS: () => ORIGINS,
  PORT: () => PORT
});
var PORT = Number(process.env.SERVER_PORT);
var ORIGINS = (process.env.SERVER_ORIGINS ?? "").split(",");
var DB_URI = process.env.SERVER_DB_URI ?? "";
var DB_NAME = process.env.SERVER_DB_NAME ?? "";
var DATA_SIZE = process.env.SERVER_DATA_SIZE ?? "";
var CRYPTO_SECRET = process.env.SERVER_CRYPTO_SECRET ?? "";
var IS_SINGLE_DB = process.env.IS_SINGLE_DB === "true";

// src/utils/env.ts
function processEnv() {
  const ignoredKeys = !IS_SINGLE_DB ? ["DB_URI", "DB_NAME", "DATA_SIZE", "IS_SINGLE_DB"] : [];
  for (const [key, value] of Object.entries(env_exports)) {
    if (ignoredKeys.includes(key))
      continue;
    if (!value) {
      throw new Error(`${key} environment variable value is invalid`);
    }
  }
  return env_exports;
}
function getDirname(moduleUrl) {
  return path__default.default.dirname(url.fileURLToPath(moduleUrl));
}
function calcAverage(numbers) {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
}
async function withDuration(callback) {
  const durationHumanizer = humanizeDuration__default.default.humanizer({
    spacer: "",
    language: "short",
    languages: {
      short: {
        m: () => "m",
        s: (count) => count?.toString()[0] === "0" ? "ms" : "s",
        ms: () => "ms"
      }
    }
  });
  function splitDuration(duration, ms2) {
    const _duration = duration.match(/^0./) ? duration.split(/^0./)[1] : duration;
    const unit = _duration.match(/[a-zA-Z]+/g)?.[0] ?? "";
    const value = unit === "ms" ? ms2 : _duration.split(unit)[0];
    return [value, unit];
  }
  const startTime = performance.now();
  const result = await callback();
  const endTime = performance.now();
  const ms = Math.abs(differenceInMilliseconds__default.default(startTime, endTime));
  const durationParts = splitDuration(durationHumanizer(ms), ms);
  return [result, ms, ...durationParts];
}
async function processAsChunks(array, onChunk, chunkSize = 1e4) {
  const total = array.length;
  for (let i = 0; i < total; i += chunkSize) {
    await onChunk(array.slice(i, i + chunkSize));
  }
}

// src/utils/connection.ts
var import_cookie = __toESM(require_cookie(), 1);
var { CRYPTO_SECRET: CRYPTO_SECRET2 } = processEnv();
function encrypt(value) {
  let _value = typeof value === "string" ? value : "";
  if (typeof value === "object") {
    _value = JSON.stringify(value);
  }
  if (typeof value === "number") {
    _value = value.toString();
  }
  return crypto__default.default.AES.encrypt(_value, CRYPTO_SECRET2).toString();
}
function decrypt(value) {
  return crypto__default.default.AES.decrypt(value, CRYPTO_SECRET2).toString(crypto__default.default.enc.Utf8);
}

// src/utils/connection.ts
function setResponseConnectionConfigCookie(res, config) {
  res.cookie("connectionConfig", encrypt(config), { maxAge: 2592e5, httpOnly: true });
}
function parseConnectionConfigCookie(cookies) {
  if (!cookies) {
    throw new Error("Cookies undefined");
  }
  let _cookies = cookies;
  if (typeof _cookies === "string") {
    _cookies = (0, import_cookie.parse)(_cookies);
  }
  const { connectionConfig: connectionConfig2 } = _cookies;
  if (!connectionConfig2) {
    throw new Error("Connection config cookie is undefined", { cause: "CONNECTION_CONFIG" });
  }
  const config = JSON.parse(decrypt(connectionConfig2));
  if (!config) {
    throw new Error("Connection config value is invalid", { cause: "CONNECTION_CONFIG" });
  }
  return config;
}

// src/middlewares/connectionConfig.ts
var connectionConfig = async (req, res, next) => {
  try {
    const connectionConfig2 = parseConnectionConfigCookie(req.cookies);
    req.connectionConfig = connectionConfig2;
    return next();
  } catch (error) {
    return next(error);
  }
};
async function connectDB(config) {
  if (!config.mongoURI) {
    throw new Error("Mongo URI is undefined");
  }
  if (!config.dbName) {
    throw new Error("Database name is undefined");
  }
  const client = new mongodb.MongoClient(config.mongoURI);
  await client.connect();
  const db = client.db(config.dbName);
  return { client, db };
}
function createDBConnection(config) {
  if (!config) {
    throw new Error("Connection config is undefined");
  }
  const { mongoURI, dbName } = config;
  if (!mongoURI) {
    throw new Error("Mongo URI is undefined");
  }
  if (!dbName) {
    throw new Error("Database name is undefined");
  }
  return connectDB({ mongoURI, dbName });
}

// src/middlewares/dbConnection.ts
var dbConnection = async (req, res, next) => {
  try {
    const { client, db } = await createDBConnection(req.connectionConfig);
    req.dbClient = client;
    req.db = db;
    return next();
  } catch (error) {
    return next(error);
  }
};

// src/middlewares/validateRoute.ts
function validateRoute(...schemas) {
  return async (req, res, next) => {
    try {
      for await (const schema of schemas) {
        if (!schema)
          continue;
        await schema.parseAsync({
          body: req.body,
          query: req.query,
          params: req.params
        });
      }
      return next();
    } catch (error) {
      return next(error);
    }
  };
}

// src/routes/connection.ts
var connectionRouter = express12__default.default.Router();
var { DB_URI: DB_URI2, DB_NAME: DB_NAME2, DATA_SIZE: DATA_SIZE2, IS_SINGLE_DB: IS_SINGLE_DB2 } = processEnv();
var validationSchema = IS_SINGLE_DB2 ? void 0 : zod4__default.default.object({
  body: zod4__default.default.object({
    mongoURI: zod4__default.default.string({ required_error: "MongoURI is required" }).nonempty(),
    dbName: zod4__default.default.string({ required_error: "Database name is required" }).nonempty(),
    dataSize: zod4__default.default.string({ required_error: "Dataset size is required" }).nonempty()
  })
});
connectionRouter.post("/connection", validateRoute(validationSchema), async (req, res, next) => {
  try {
    let config = req.body;
    if (IS_SINGLE_DB2) {
      config = {
        mongoURI: DB_URI2,
        dbName: DB_NAME2,
        dataSize: DATA_SIZE2,
        userId: ""
      };
    }
    if (!config.shouldGenerateData) {
      const { client } = await createDBConnection(config);
      const db = client.db(config.dbName);
      const meta = await db.collection("meta").findOne();
      if (meta) {
        config.dataSize = meta.dataSize ?? config.dataSize;
      }
    }
    setResponseConnectionConfigCookie(res, config);
    return res.status(200).json({ message: "Config set" });
  } catch (error) {
    return next(error);
  }
});
connectionRouter.get("/connection", connectionConfig, async (req, res, next) => {
  try {
    return res.status(200).json(req.connectionConfig);
  } catch (error) {
    return next(error);
  }
});
connectionRouter.put(
  "/connection",
  connectionConfig,
  validateRoute(validationSchema),
  async (req, res, next) => {
    try {
      const { connectionConfig: connectionConfig2 } = req;
      const { client } = await createDBConnection(req.body);
      const db = client.db(req.body.dbName);
      const meta = await db.collection("meta").findOne();
      let dataSize = req.body.dataSize;
      if (meta) {
        if (connectionConfig2.dbName !== req.body.dbName) {
          dataSize = meta.dataSize !== req.body.dataSize ? req.body.dataSize : meta.dataSize;
        }
        if (!req.body.shouldGenerateData) {
          dataSize = meta.dataSize;
        }
      }
      setResponseConnectionConfigCookie(res, { ...connectionConfig2, ...req.body, dataSize });
      return res.status(200).json({ message: "Config updated" });
    } catch (error) {
      return next(error);
    }
  }
);
async function validateData(db, dataSize) {
  try {
    const existedCollectionNames = (await db.listCollections().toArray()).map(({ name }) => name);
    const requiredCollectionNames = ["categories", "orders", "products", "ratings", "tags", "users"];
    let isDataValid = true;
    for await (const requiredCollectionName of requiredCollectionNames) {
      isDataValid = existedCollectionNames.includes(requiredCollectionName);
      isDataValid = Boolean(await db.collection(requiredCollectionName).countDocuments());
      if (!isDataValid)
        break;
    }
    if (dataSize) {
      const metaDataSize = (await db.collection("meta").find().toArray())[0]?.dataSize;
      const isDataSizeValid = metaDataSize === dataSize;
      isDataValid = isDataValid && isDataSizeValid;
    }
    return isDataValid;
  } catch (error) {
    return false;
  }
}
async function processDatasetFiles(collectionName, size, onData) {
  const dirPath = `${getDirname((typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.src || new URL('out.js', document.baseURI).href)))}/../data/dataset-${size}`;
  const fileNames = await fs__default.default.promises.readdir(dirPath);
  const collectionFileNames = fileNames.filter((path3) => {
    return path3.startsWith(`dataset-${size}-${collectionName}`);
  });
  for await (const fileName of collectionFileNames) {
    const fileContent = await fs__default.default.promises.readFile(`${dirPath}/${fileName}`, "utf-8");
    const dataset = JSON.parse(fileContent);
    await onData(dataset);
  }
}
function createUser() {
  const createdAt = (/* @__PURE__ */ new Date()).toString();
  return {
    id: new mongodb.ObjectId().toString(),
    createdAt,
    updatedAt: createdAt
  };
}
function createFlatOrders(userId, prodcutIds) {
  const itemId = new mongodb.ObjectId().toString();
  const createdAt = /* @__PURE__ */ new Date();
  return prodcutIds.map((productId) => ({
    id: new mongodb.ObjectId().toString(),
    itemId,
    productId,
    userId,
    createdAt,
    updatedAt: createdAt
  }));
}

// src/routes/data.ts
var dataRouter = express12__default.default.Router();
dataRouter.get("/data/validate", async (req, res, next) => {
  try {
    const { db, connectionConfig: connectionConfig2 } = req;
    const isValid = await validateData(db, connectionConfig2.dataSize);
    if (!isValid && !connectionConfig2.shouldGenerateData) {
      return res.status(200).send(true);
    }
    return res.status(200).send(isValid);
  } catch (error) {
    return next(error);
  }
});
dataRouter.post(
  "/data/set",
  validateRoute(zod4__default.default.object({ query: zod4__default.default.object({ force: zod4__default.default.string().optional() }) })),
  async (req, res, next) => {
    try {
      const { db, connectionConfig: connectionConfig2, query } = req;
      const isForced = query.force === "true" || query.force;
      const collectionNames = [
        "users",
        "categories",
        "tags",
        "products",
        "ratings",
        "orders"
      ];
      if (!isForced && await validateData(db, connectionConfig2.dataSize)) {
        return res.status(200).json({ message: "Data already exists" });
      }
      await db.dropDatabase();
      for await (const collectionName of collectionNames) {
        const collection = db.collection(collectionName);
        await processDatasetFiles(collectionName, connectionConfig2.dataSize, async (data) => {
          await processAsChunks(data, async (chunk) => {
            await collection.insertMany(prepareDates(chunk));
          });
        });
      }
      await db.collection("meta").insertOne({ dataSize: connectionConfig2.dataSize });
      return res.status(201).json({ message: "Data set" });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
);
function prepareDates(arr) {
  return arr.map((item) => {
    if ("createdAt" in item || "updatedAt" in item) {
      item.createdAt = new Date(item.createdAt);
      item.updatedAt = new Date(item.updatedAt);
    }
    return item;
  });
}

// src/queries/getUserRecommProducts.ts
async function getUserRecommProductsQuery(db, userId) {
  const userActionProducts = await db.collection("ratings").aggregate([
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
  ]).toArray();
  const productIds = userActionProducts.map(({ id }) => id);
  return await db.collection("orders").aggregate([
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
  ]).toArray();
}

// src/routes/user.ts
var userRouter = express12__default.default.Router();
userRouter.post("/user", async (req, res, next) => {
  try {
    const { db, connectionConfig: connectionConfig2 } = req;
    if (!connectionConfig2) {
      throw new Error("Connection config is undefined");
    }
    let userId = connectionConfig2.userId;
    if (!userId) {
      const user = createUser();
      await db.collection("users").insertOne(user);
      userId = user.id;
      setResponseConnectionConfigCookie(res, { ...connectionConfig2, userId });
    }
    return res.status(201).json({ id: userId });
  } catch (error) {
    return next(error);
  }
});
userRouter.get("/user/orders", async (req, res, next) => {
  try {
    const {
      db,
      dbClient,
      connectionConfig: { userId }
    } = req;
    const orders = await db.collection("orders").find({ userId }).toArray();
    return res.status(200).send(orders);
  } catch (error) {
    return next(error);
  }
});
userRouter.get("/user/ratings", async (req, res, next) => {
  try {
    const {
      db,
      dbClient,
      connectionConfig: { userId }
    } = req;
    const ratings = await db.collection("ratings").find({ userId }).toArray();
    return res.status(200).send(ratings);
  } catch (error) {
    return next(error);
  }
});
userRouter.get("/user/recomm-products", async (req, res, next) => {
  try {
    const {
      db,
      connectionConfig: { userId }
    } = req;
    const products = await withDuration(() => getUserRecommProductsQuery(db, userId));
    return res.status(200).send(products);
  } catch (error) {
    return next(error);
  }
});
var categoryRouter = express12__default.default.Router();
categoryRouter.get("/categories", async (req, res, next) => {
  try {
    const { db } = req;
    const categories = await db.collection("categories").find().toArray();
    return res.status(200).send(categories);
  } catch (error) {
    return next(error);
  }
});
var tagRouter = express12__default.default.Router();
tagRouter.get("/tags", async (req, res, next) => {
  try {
    const { db } = req;
    const tags = await db.collection("tags").find().toArray();
    return res.status(200).send(tags);
  } catch (error) {
    return next(error);
  }
});
var infoRouter = express12__default.default.Router();
infoRouter.get("/info", async (req, res, next) => {
  try {
    const { db } = req;
    const [dbStats, orderRecords, productsNumber, ratingsNumber] = await Promise.all([
      db.stats(),
      db.collection("orders").countDocuments(),
      db.collection("products").countDocuments(),
      db.collection("ratings").countDocuments()
    ]);
    return res.status(200).json({ dbStats, orderRecords, productsNumber, ratingsNumber });
  } catch (error) {
    return next(error);
  }
});
var ratingRouter = express12__default.default.Router();
ratingRouter.post(
  "/rating",
  validateRoute(
    zod4__default.default.object({
      body: zod4__default.default.object({
        productId: zod4__default.default.string({ required_error: "Product id is required" }).nonempty(),
        value: zod4__default.default.number({ required_error: "Value is required" }).min(0).max(5)
      })
    })
  ),
  async (req, res, next) => {
    try {
      const { db, connectionConfig: connectionConfig2 } = req;
      const body = req.body;
      const createdAt = (/* @__PURE__ */ new Date()).toString();
      const newRating = {
        id: new mongodb.ObjectId().toString(),
        userId: connectionConfig2.userId,
        productId: body.productId,
        value: body.value,
        createdAt,
        updatedAt: createdAt
      };
      const rating = await db.collection("ratings").insertOne(newRating);
      res.status(200).json({ ...newRating, _id: rating.insertedId });
      const productRatings = await db.collection("ratings").find({ productId: body.productId }).toArray();
      const productVotes = productRatings.map(({ value }) => value);
      const newProductRating = Math.round(calcAverage(productVotes));
      db.collection("products").updateOne({ id: body.productId }, { $set: { rating: newProductRating } });
    } catch (error) {
      return next(error);
    }
  }
);

// src/queries/getTopProducts.ts
async function getTopProductsQuery(db, filter) {
  const { from, number } = filter ?? {};
  const $match = {};
  if (from) {
    $match.createdAt = { $gte: from };
  }
  const pipeline = [
    { $match },
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
    { $sort: { sales: -1 } }
  ];
  if (number) {
    pipeline.push({ $limit: Number(number) });
  }
  return await db.collection("orders").aggregate(pipeline).toArray();
}

// src/queries/getProductSales.ts
async function getProductSalesQuery(db, filter) {
  const { productId, from } = filter;
  const $match = { productId };
  if (from) {
    $match.createdAt = { $gte: from };
  }
  const pipeline = [
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

// src/queries/getRelatedProducts.ts
async function getRelatedProductsQuery(db, filter) {
  const { productId } = filter;
  const product = (await db.collection("products").aggregate([{ $match: { id: productId } }]).toArray())?.[0];
  const pipeline = [
    { $match: { id: { $ne: productId }, name: { $ne: product.name }, tagIds: { $in: product.tagIds } } },
    { $limit: 5 },
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "id",
        as: "category"
      }
    },
    { $unwind: "$category" }
  ];
  return await db.collection("products").aggregate(pipeline).toArray();
}

// src/queries/getProducts.ts
async function getProductsQuery(db, filter) {
  const perPage = filter.perPage ?? 12;
  const page = Number(filter.page ?? 1);
  const pipeline = [];
  const $and = [];
  if (filter.category?.length) {
    $and.push({ categoryId: { $in: filter.category } });
  }
  if (filter.tag?.length) {
    $and.push({ tagId: { $in: filter.tag } });
  }
  if (filter.price?.length) {
    const _$or = [];
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
  const { total } = (await db.collection("products").aggregate([...pipeline, { $count: "total" }]).toArray())[0] ?? {};
  if (filter.sort) {
    const [field, direction] = filter.sort.split(":");
    pipeline.push({ $sort: { [field]: Number(direction) } });
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

// src/routes/product.ts
var productRouter = express12__default.default.Router();
var validateId = zod4__default.default.object({ params: zod4__default.default.object({ id: zod4__default.default.string().nonempty().optional() }).optional() });
var validateNumber = zod4__default.default.object({ query: zod4__default.default.object({ number: zod4__default.default.string().optional() }) });
var validateFrom = zod4__default.default.object({
  query: zod4__default.default.object({ from: zod4__default.default.string().nonempty().optional() }).optional()
});
async function getRandomProductId(db) {
  return (await db.collection("products").aggregate([{ $sample: { size: 1 } }, { $project: { _id: 0, id: 1 } }]).toArray())[0].id;
}
productRouter.get("/product/:id", validateRoute(validateId), async (req, res, next) => {
  try {
    const { db, params } = req;
    const id = params.id ?? await getRandomProductId(db);
    const product = await withDuration(() => {
      return db.collection("products").aggregate([
        { $match: { id } },
        {
          $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "id",
            as: "category"
          }
        },
        { $unwind: "$category" }
      ]).toArray();
    });
    return res.status(200).send(product[0]);
  } catch (error) {
    return next(error);
  }
});
productRouter.get(`/product/:id/sales`, validateRoute(validateId, validateFrom), async (req, res) => {
  try {
    const { db } = req;
    const query = req.query;
    const id = req.params.id ?? await getRandomProductId(db);
    const from = query.from ? new Date(query.from) : subDays__default.default(/* @__PURE__ */ new Date(), 90);
    const sales = await withDuration(() => getProductSalesQuery(db, { productId: id, from }));
    return res.status(200).send(sales);
  } catch (error) {
    return res.status(200).send([]);
  }
});
productRouter.get(`/product/:id/related-products`, validateRoute(validateId), async (req, res) => {
  try {
    const { db } = req;
    const id = req.params.id ?? await getRandomProductId(db);
    const products = await withDuration(() => getRelatedProductsQuery(db, { productId: id }));
    return res.status(200).send(products);
  } catch (error) {
    return res.status(200).send([]);
  }
});
productRouter.get("/products", async (req, res, next) => {
  try {
    const { db } = req;
    const products = await db.collection("products").find().toArray();
    return res.status(200).send(products);
  } catch (error) {
    return next(error);
  }
});
productRouter.get("/products/filter", async (req, res, next) => {
  try {
    const { db } = req;
    const products = await withDuration(() => getProductsQuery(db, req.query));
    return res.status(200).send(products);
  } catch (error) {
    return next(error);
  }
});
productRouter.get(`/products/prices`, async (req, res) => {
  try {
    const { db } = req;
    const prices = await db.collection("products").aggregate([{ $group: { _id: null, values: { $addToSet: "$price" } } }]).toArray();
    return res.status(200).send(prices[0]?.values.sort());
  } catch (error) {
    return res.status(200).send([]);
  }
});
productRouter.get(`/products/ratings`, async (req, res) => {
  try {
    const { db } = req;
    const ratings = await db.collection("products").aggregate([{ $group: { _id: null, values: { $addToSet: "$rating" } } }]).toArray();
    return res.status(200).send(ratings[0]?.values.sort());
  } catch (error) {
    return res.status(200).send([]);
  }
});
productRouter.get(`/products/top`, validateRoute(validateNumber), async (req, res) => {
  try {
    const { db } = req;
    const query = req.query;
    const products = await withDuration(() => getTopProductsQuery(db, { number: query.number }));
    return res.status(200).send(products);
  } catch (error) {
    return res.status(200).send([]);
  }
});
productRouter.get(`/products/trending`, validateRoute(validateNumber, validateFrom), async (req, res) => {
  try {
    const { db } = req;
    const query = req.query;
    const from = query.from ? new Date(query.from) : subDays__default.default(/* @__PURE__ */ new Date(), 90);
    const products = await withDuration(() => getTopProductsQuery(db, { from, number: query.number }));
    return res.status(200).send(products);
  } catch (error) {
    return res.status(200).send([]);
  }
});
var orderRouter = express12__default.default.Router();
orderRouter.post(
  "/order",
  validateRoute(zod4__default.default.object({ body: zod4__default.default.object({ productIds: zod4__default.default.array(zod4__default.default.string()) }) })),
  async (req, res, next) => {
    try {
      const {
        db,
        dbClient,
        connectionConfig: { userId }
      } = req;
      const body = req.body;
      const flatOrders = createFlatOrders(userId, body.productIds);
      await db.collection("orders").insertMany(flatOrders);
      return res.status(201).send(flatOrders);
    } catch (error) {
      return next(error);
    }
  }
);
var configRouter = express12__default.default.Router();
configRouter.get("/config", async (req, res, next) => {
  try {
    const { DB_URI: DB_URI3, ...rest } = env_exports;
    return res.status(200).json(rest);
  } catch (error) {
    return next(error);
  }
});

// src/routes/index.ts
var withConnectionRouter = express12__default.default.Router();
withConnectionRouter.use(connectionConfig);
withConnectionRouter.use(dbConnection);
[
  dataRouter,
  userRouter,
  categoryRouter,
  tagRouter,
  ratingRouter,
  productRouter,
  orderRouter,
  infoRouter
].forEach((route) => withConnectionRouter.use(route));
var apiRouter = express12__default.default.Router();
[configRouter, connectionRouter, withConnectionRouter].forEach((route) => apiRouter.use(route));
var { ORIGINS: ORIGINS2 } = processEnv();
var socketServer;
function initSocket(server2, onInit, onConnection) {
  socketServer = new socket_io.Server(server2, { cors: { origin: ORIGINS2, credentials: true }, cookie: true });
  socketServer.on("connection", (socket) => {
    onConnection?.(socket);
  });
  onInit?.(socketServer);
}

// src/events/user.ts
var userSocketEventsHandler = (socket) => {
  socket.on("recomm", async () => {
    try {
      const connectionConfig2 = parseConnectionConfigCookie(socket.request.headers.cookie);
      const { db, client } = await createDBConnection(connectionConfig2);
      socket.emit("recomm.loading", true);
      const data = await withDuration(() => getUserRecommProductsQuery(db, connectionConfig2.userId));
      client.close();
      socket.emit("recomm.data", data);
    } catch (error) {
      socket.emit("recomm.error", error);
    }
  });
};

// src/events/index.ts
var socketEventsHandler = (socket) => {
  [userSocketEventsHandler].forEach((events) => events(socket));
};

// src/index.ts
var { ORIGINS: ORIGINS3, PORT: PORT2 } = processEnv();
var app = express12__default.default();
var server = http__default.default.createServer(app);
app.use(morgan__default.default("dev"));
app.use(cors__default.default({ origin: ORIGINS3, credentials: true }));
app.use(helmet__default.default());
app.use(cookieParser__default.default());
app.use(express12__default.default.json());
app.use("/images", express12__default.default.static(path__default.default.join(getDirname((typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.src || new URL('out.js', document.baseURI).href))), "data/images")));
app.use("/api", apiRouter);
initSocket(
  server,
  () => {
    server.listen(PORT2, () => {
      console.log(`Server started on port: ${PORT2}`);
      app.use(errorHandler);
    });
  },
  socketEventsHandler
);
/*! Bundled license information:

cookie/index.js:
  (*!
   * cookie
   * Copyright(c) 2012-2014 Roman Shtylman
   * Copyright(c) 2015 Douglas Christopher Wilson
   * MIT Licensed
   *)
*/
