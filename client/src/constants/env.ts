export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "";
export const IS_SINGLE_DB = process.env.NEXT_PUBLIC_IS_SINGLE_DB === "true";
export const WITH_DATA_GENERATION = process.env.NEXT_PUBLIC_WITH_DATA_GENERATION === "true";

export const BASE_API =
  process.env.NODE_ENV === "development"
    ? !global.window
      ? "http://server:4000/api"
      : "http://localhost:4000/api"
    : `${SERVER_URL}/api`;
