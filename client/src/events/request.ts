import EventEmitter from "events";
import { AxiosResponse } from "axios";

import { WithDuration } from "@/types/api";
import { proccessError } from "@/api/instance";

type ResultPayload = {
  title?: string;
  data?: WithDuration;
  isLoading?: boolean;
};

const eventEmitter = new EventEmitter();

export const requestEvents = {
  emit: (payload: ResultPayload) => {
    eventEmitter.emit("request", payload);
  },

  reset: (payload?: ResultPayload) => {
    eventEmitter.emit("request.reset", payload);
  },

  onResult: (callback: (payload: ResultPayload) => void) => {
    eventEmitter.on("request", callback);
    return () => eventEmitter.off("request", callback);
  },

  onReset: (callback: (payload: ResultPayload) => void) => {
    eventEmitter.on("request.reset", callback);
    return () => eventEmitter.off("request.reset", callback);
  },
};

export async function withRequestEvent<T extends () => Promise<AxiosResponse<WithDuration<any>>>>(
  request: T,
  title?: string,
) {
  return (await request()) as ReturnType<T>;

  if (!title) {
    return (await request()) as ReturnType<T>;
  }

  try {
    requestEvents.emit({ title, isLoading: true });
    const result = await request();
    requestEvents.emit({ title, data: result.data, isLoading: false });
    return result as ReturnType<T>;
  } catch (error) {
    requestEvents.reset({ title });
    proccessError(error);
  }
}
