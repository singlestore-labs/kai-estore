import { GetServerSideProps } from "next";

import { ROUTES } from "@/constants/routes";
import { COOKIE_KEYS } from "@/constants/cookie";
import { RootStateValues } from "@/state";
import { categoriesState } from "@/state/categories";
import { productPricesState } from "@/state/productPrices";
import { productRatingsState } from "@/state/productRatings";
import { productsState, urlParamsToProductParams } from "@/state/products";
import { tagsState } from "@/state/tags";
import { topOneProductState } from "@/state/topOneProduct";
import { trendingProductsState } from "@/state/trendingProducts";
import { userOrdersState } from "@/state/userOrders";
import { userRatingsState } from "@/state/userRatings";
import { apiInstance } from "@/api/instance";
import { api } from "@/api";
import { WITH_DATA_GENERATION } from "@/constants/env";

export const getDefaultServerSideProps = ({ redirect }: { redirect?: string } = {}) => {
  return (async (context) => {
    try {
      const { req, res } = context;

      if (redirect) {
        return {
          redirect: {
            destination: redirect,
            permanent: false,
          },
        };
      }

      if (context.req.url?.startsWith("/_next")) return { props: {} };

      let props = { rootState: {} as RootStateValues };

      const hasConnectionConfig = COOKIE_KEYS.connectionConfig in req.cookies;
      let shouldRedirectToConnect = !hasConnectionConfig;

      if (hasConnectionConfig) {
        apiInstance.defaults.headers["x-connection-config"] = req.cookies.connectionConfig as string;

        if (WITH_DATA_GENERATION) {
          try {
            shouldRedirectToConnect = !(await api.data.validate()).data;
          } catch (error) {
            shouldRedirectToConnect = true;
          }
        }
      }

      if (shouldRedirectToConnect) {
        res.setHeader(
          "Set-Cookie",
          `${COOKIE_KEYS.connectionConfig}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`,
        );

        return {
          redirect: {
            destination: ROUTES.connect,
            permanent: false,
          },
        };
      }

      let stateSetters: [string, () => any][] = [
        [categoriesState.name, () => categoriesState.getValue()],
        [productPricesState.name, () => productPricesState.getValue()],
        [productRatingsState.name, () => productRatingsState.getValue()],
        [tagsState.name, () => tagsState.getValue()],
        [trendingProductsState.name, () => trendingProductsState.getValue({ number: 5 })],
        [topOneProductState.name, () => topOneProductState.getValue()],
        [userOrdersState.name, () => userOrdersState.getValue()],
        [userRatingsState.name, () => userRatingsState.getValue()],
      ];

      await Promise.all(
        stateSetters.map(async ([name, query]) => {
          props.rootState = Object.assign(props.rootState, { [name]: await query() });
        }),
      );

      props.rootState.productsState = await productsState.getValue([
        urlParamsToProductParams(context.query, props.rootState.categoriesState, props.rootState.tagsState),
      ]);

      return { props };
    } catch (error) {
      return { props: {} };
    }
  }) satisfies GetServerSideProps;
};
