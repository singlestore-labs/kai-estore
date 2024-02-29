import fs from "fs";
import path from "path";
import prettier from "prettier";

import { getProductsQuery } from "./src/queries/getProducts";
import { getProductSalesQuery } from "./src/queries/getProductSales";
import { getRelatedProductsQuery } from "./src/queries/getRelatedProducts";
import { getTopProductsQuery } from "./src/queries/getTopProducts";
import { getUserRecommProductsQuery } from "./src/queries/getUserRecommProducts";
import { fileURLToPath } from "url";

(async () => {
  const queries = {
    getProductsQuery,
    getProductSalesQuery,
    getRelatedProductsQuery,
    getTopProductsQuery,
    getUserRecommProductsQuery
  };

  for (const key in queries) {
    const fn = queries[key as keyof typeof queries];
    const fnString = await prettier.format(fn.toString(), { parser: "babel" });

    const outputPath = path.relative(
      path.dirname(fileURLToPath(import.meta.url)),
      `../client/public/data/${key}.txt`
    );

    await fs.promises.writeFile(outputPath, fnString);
  }
})();
