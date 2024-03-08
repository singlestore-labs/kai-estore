import { GetServerSideProps } from "next";

import { ROUTES } from "@/constants/routes";
import { COOKIE_KEYS } from "@/constants/cookie";
import { RootStateValues } from "@/state";
import { categoriesState } from "@/state/categories";
import { productPricesState } from "@/state/productPrices";
import { productRatingsState } from "@/state/productRatings";
import { tagsState } from "@/state/tags";
import { apiInstance } from "@/api/instance";
import { api } from "@/api";
import { connectionState } from "@/state/connection";

export const getDefaultServerSideProps = ({ redirect }: { redirect?: string } = {}) => {
  return (async (context) => {
    try {
      const { req, res } = context;

      if (redirect) {
        return {
          redirect: {
            destination: redirect,
            permanent: false
          }
        };
      }

      if (context.req.url?.startsWith("/_next")) return { props: {} };

      const props = { rootState: {} as RootStateValues };

      const hasConnectionConfig = COOKIE_KEYS.connectionConfig in req.cookies;
      // const shouldRedirectToConnect = !hasConnectionConfig;

      if (hasConnectionConfig) {
        apiInstance.defaults.headers["x-connection-config"] = req.cookies.connectionConfig as string;

        // try {
        //   shouldRedirectToConnect = !(await api.data.validate({ connection: "config" })).data;
        // } catch (error) {
        //   shouldRedirectToConnect = true;
        // }
      }

      // if (shouldRedirectToConnect) {
      //   res.setHeader(
      //     "Set-Cookie",
      //     `${COOKIE_KEYS.connectionConfig}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
      //   );

      //   return {
      //     redirect: {
      //       destination: ROUTES.connect,
      //       permanent: false
      //     }
      //   };
      // }

      const stateSetters: [string, () => any][] = [
        [categoriesState.name, () => categoriesState.getValue()],
        [productPricesState.name, () => productPricesState.getValue()],
        [productRatingsState.name, () => productRatingsState.getValue()],
        [tagsState.name, () => tagsState.getValue()],
        [connectionState.name, () => connectionState.getValue({ isExist: !!req.cookies.connectionConfig })]
      ];

      await Promise.all(
        stateSetters.map(async ([name, query]) => {
          props.rootState = Object.assign(props.rootState, { [name]: await query() });
        })
      );

      return { props };
    } catch (error) {
      return { props: {} };
    }
  }) satisfies GetServerSideProps;
};
