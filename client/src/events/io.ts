import { useEffect } from "react";
// import { io as socketIo } from "socket.io-client";

import { RecommProduct, WithDuration } from "@/types/api";
// import { SOCKET_URL } from "@/constants/env";
import { proccessError } from "@/api/instance";
import { requestEvents } from "./request";

// const io = socketIo(SOCKET_URL, { withCredentials: true });
const io: any = {};

export const ioEvents = {
  recomm: {
    emit: () => {
      // io.emit("recomm");
    },

    onLoading: (callback: (isLoading: boolean) => void) => {
      io.on("recomm.loading", callback);
      return () => io.off("recomm.loading", callback);
    },

    onData: (callback: (data: WithDuration<RecommProduct[]>) => void) => {
      io.on("recomm.data", callback);
      return () => io.off("recomm.data", callback);
    },

    onError: (callback: (data: unknown) => void) => {
      io.on("recomm.error", callback);
      return () => io.off("recomm.error", callback);
    },
  },
};

export function SocketController() {
  useEffect(() => {
    const listenerRemovers: (typeof io.off)[] = [];

    listenerRemovers.push(
      ioEvents.recomm.onLoading(() => {
        requestEvents.emit({
          title: "Get recommendations",
          isLoading: true,
        });
      }),
    );

    listenerRemovers.push(
      ioEvents.recomm.onData((data) => {
        requestEvents.emit({
          title: "Get recommendations",
          data,
          isLoading: false,
        });
      }),
    );

    listenerRemovers.push(ioEvents.recomm.onError(proccessError));

    return () => {
      listenerRemovers.forEach((listener) => listener?.());
    };
  }, []);

  return null;
}
