import fs from "fs";
import path from "path";
import prettier from "prettier";

import { getProductsQuery } from "./src/queries/getProducts";
import { getTopProductsQuery } from "./src/queries/getTopProducts";
import { getTopProductSalesQuery } from "./src/queries/getTopProductSales";
import { fileURLToPath } from "url";

(async () => {
  const queries = {
    getProductsQuery,
    getTopProductsQuery,
    getTopProductSalesQuery
  };

  for (const key in queries) {
    const fn = queries[key as keyof typeof queries];
    const fnString = await prettier.format(fn.toString(), { parser: "babel" });

    const outputPath = path.relative(
      path.dirname(fileURLToPath(import.meta.url)),
      `./src/data/code-blocks/${key}.txt`
    );

    await fs.promises.writeFile(outputPath, fnString);
  }
})();
