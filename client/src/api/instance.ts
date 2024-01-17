import axios, { AxiosError } from "axios";

import { BASE_API } from "@/constants/env";
import { ROUTES } from "@/constants/routes";
import { errorToast } from "@/utils/toast";

export const apiInstance = axios.create({ baseURL: BASE_API, withCredentials: true });

apiInstance.interceptors.response.use((response) => response, proccessError);

export function apiRequestToken() {
  return axios.CancelToken.source();
}

export function proccessError(error: unknown) {
  if ((error as any).code === "ERR_CANCELED") {
    return Promise.reject("Request canceled");
  }

  if (global.window) {
    let title = "";
    let description = "";

    if (error instanceof AxiosError) {
      title = error.message;

      if ("error" in error.response?.data) {
        title = error.response?.data.error;
      }

      if (error.response?.status === 401) {
        title = "Session expired";
        description = "The page will reload in 3 seconds.";
        setTimeout(() => global.window.location.reload(), 3000);
      }

      if (isZodError(error.response?.data)) {
        title = "Validation error";
        description = error.response?.data.error[0].message ?? "";
      }

      if (error.response?.data?.codeName === "MaxTimeMSExpired") {
        title = "Query time limit exceeded";
        description = "";
      }

      if ("cause" in error.response?.data) {
        if (error.response?.data.cause === "CONNECTION_CONFIG") {
          title = "Connection expired";
          window.location.replace(ROUTES.connect);
        }
      }
    }

    if (isIoError(error)) {
      if ("codeName" in error.error && error.error.codeName === "MaxTimeMSExpired") {
        title = "Query time limit exceeded";
        description = "";
      }
    }

    if (title || description) {
      errorToast({ title, description });
    }
  }

  return Promise.reject(error);
}

function isZodError(error: unknown): error is {
  error: {
    code: string;
    message: string;
    path: string[];
    expected: string;
    received: string;
  }[];
} {
  if (typeof error === "object" && error !== null && "error" in error && Array.isArray(error.error)) {
    return Object.keys(error.error[0]).some((key) => ["code", "expected"].includes(key));
  }

  return false;
}

function isIoError(error: unknown): error is { error: object } {
  return error instanceof Object && "source" in error && "error" in error;
}
