export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "";
export const IS_SINGLE_DB = process.env.NEXT_PUBLIC_IS_SINGLE_DB === "true";
export const SOCKET_URL = SERVER_URL;

export const BASE_API = `${SERVER_URL}/api`;

export const IS_UNDER_DEVELOPMENT = process.env.NEXT_PUBLIC_IS_UNDER_DEVELOPMENT === "true";
