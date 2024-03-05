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
import { WITH_DATA_GENERATION } from "@/constants/env";

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

      if (!WITH_DATA_GENERATION) {
        const connection = await api.connection.create({ mongoURI: "", dbName: "", dataSize: "" });
        apiInstance.defaults.headers["x-connection-config"] = connection.headers["x-connection-config"];

        const user = await api.user.create();
        const config = user.headers["x-connection-config"];
        apiInstance.defaults.headers["x-connection-config"] = config;
        res.setHeader("Set-Cookie", `${COOKIE_KEYS.connectionConfig}=${config}; path=/`);
      }

      const hasConnectionConfig = COOKIE_KEYS.connectionConfig in req.cookies;
      let shouldRedirectToConnect = WITH_DATA_GENERATION ? !hasConnectionConfig : false;

      if (hasConnectionConfig) {
        apiInstance.defaults.headers["x-connection-config"] = req.cookies.connectionConfig as string;

        if (WITH_DATA_GENERATION) {
          try {
            shouldRedirectToConnect = !(await api.data.validate({ connection: "config" })).data;
          } catch (error) {
            shouldRedirectToConnect = true;
          }
        }
      }

      if (shouldRedirectToConnect) {
        res.setHeader(
          "Set-Cookie",
          `${COOKIE_KEYS.connectionConfig}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
        );

        return {
          redirect: {
            destination: ROUTES.connect,
            permanent: false
          }
        };
      }

      const stateSetters: [string, () => any][] = [
        [categoriesState.name, () => categoriesState.getValue()],
        [productPricesState.name, () => productPricesState.getValue()],
        [productRatingsState.name, () => productRatingsState.getValue()],
        [tagsState.name, () => tagsState.getValue()]
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
