import * as Yup from "yup";
import * as dateFns from "date-fns";

import { Query } from "@/components/Query/QuerySection";
import { api } from "./api";

export const defaultProductImage = "/assets/images/DefaultProduct.png";

export const welcomeTabs = [
  {
    title: "Welcome to the SingleStore Kai™ eStore!",
    text: `Step into our demo retail store that supports millions of simulated customers with real-time analytics and transactions on SingleStoreDB.`,
    id: "98",
    createdAt: "",
    updatedAt: "",
    image: "/assets/gifs/Welcome.gif"
  },
  {
    title: "Shop Like a Customer",
    text: `Browse or filter items in the catalog, and see how fast each database responds.`,
    id: "95",
    createdAt: "",
    updatedAt: "",
    image: "/assets/gifs/Welcome-2.gif"
  },
  {
    title: "Get Real-Time Recommendations",
    text: `Rate or buy products to see how your recommendations change in real time.`,
    id: "81",
    createdAt: "",
    updatedAt: "",
    image: "/assets/gifs/Welcome-3.gif"
  },
  {
    title: "Put Speed to the Test",
    text: `Review database performance and run sample queries on the Analytics page.`,
    id: "17",
    createdAt: "",
    updatedAt: "",
    image: "/assets/gifs/Welcome-4.gif"
  }
];

export const queriesList: Query[] = [
  {
    title: "1. Get top products",
    params: {
      fields: {
        number: {
          element: "input",
          type: "number",
          label: "Number",
          value: "",
          placeholder: "Number of records"
        }
      },

      validationSchema: Yup.object({ number: Yup.number() })
    },
    request: (params, config) => api.product.top(params, config),
    codeBlock: "/data/getTopProductsQuery.txt"
  },

  {
    title: "2. Get trending products",
    params: {
      fields: {
        from: {
          element: "input",
          label: "From",
          value: dateFns.format(dateFns.subDays(new Date(), 90), "yyyy/MM/dd"),
          placeholder: "Start date yyyy/mm/dd"
        },
        number: {
          element: "input",
          type: "number",
          label: "Number",
          value: 10,
          placeholder: "Number of records"
        }
      },

      validationSchema: Yup.object({
        from: Yup.date().required(),
        number: Yup.number()
      })
    },
    request: (params, config) => api.product.trending(params, config),
    codeBlock: "/data/getTopProductsQuery.txt"
  },

  {
    title: "3. Get product sales history",
    params: {
      fields: {
        from: {
          element: "input",
          label: "From",
          value: dateFns.format(dateFns.subDays(new Date(), 90), "yyyy/MM/dd"),
          placeholder: "Start date yyyy/mm/dd"
        }
      },

      validationSchema: Yup.object({ from: Yup.date().required() })
    },
    request: ({ id, ...params }, config) => api.product.sales(id, params, config),
    codeBlock: "/data/getProductSalesQuery.txt"
  }
];
