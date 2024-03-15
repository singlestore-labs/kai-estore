import * as Yup from "yup";
import * as dateFns from "date-fns";

import { Query } from "@/components/Query/QuerySection";
import { api } from "./api";

export const defaultProductImage = "/assets/images/DefaultProduct.png";

export const welcomeTabs = [
  {
    title: "Welcome to the SingleStore Kai™ eStore!",
    text: `Step into our demo retail store that supports millions of simulated customers with real-time analytics and transactions.`,
    id: "98",
    createdAt: "",
    updatedAt: "",
    image: "/assets/gifs/Welcome.gif"
  },
  {
    title: "Shop Like a Customer",
    text: `Browse or filter items in the catalog, and see how fast each database performs in the analytics tab.`,
    id: "95",
    createdAt: "",
    updatedAt: "",
    image: "/assets/gifs/Welcome-2.gif"
  },
  {
    title: "Put Speed to the Test",
    text: `Compare database performance and run sample queries on the Analytics page.`,
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
    request: (...args: Parameters<typeof api.product.top>) => api.product.top(...args),
    codeBlock: "getTopProductsQuery"
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
    request: (...args: Parameters<typeof api.product.trending>) => api.product.trending(...args),
    codeBlock: "getTopProductsQuery"
  },

  {
    title: "3. Get top product sales history",
    params: {},
    request: (...args: Parameters<typeof api.product.topOneSales>) => api.product.topOneSales(...args),
    codeBlock: "getTopProductSalesQuery"
  }
];
