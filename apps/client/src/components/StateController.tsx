import { categoriesState } from "@/state/categories";
import { productPricesState } from "@/state/productPrices";
import { productRatingsState } from "@/state/productRatings";
import { tagsState } from "@/state/tags";
import { useEffect } from "react";

export function StateController() {
  const setCategories = categoriesState.setValue();
  const setPrices = productPricesState.setValue();
  const setProductRatings = productRatingsState.setValue();
  const setTags = tagsState.setValue();

  useEffect(() => {
    (async () => {
      await Promise.all(
        [
          async () => setCategories(await categoriesState.getValue()),
          async () => setPrices(await productPricesState.getValue()),
          async () => setProductRatings(await productRatingsState.getValue()),
          async () => setTags(await tagsState.getValue())
        ].map((fn) => fn())
      );
    })();
  }, [setCategories, setPrices, setProductRatings, setTags]);

  return null;
}
