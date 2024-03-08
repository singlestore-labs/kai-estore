import { useEffect } from "react";
import { io as socketIo, Socket } from "socket.io-client";

import { CDC, RecommProduct, WithDuration } from "@/types/api";
import { SOCKET_URL } from "@/constants/env";
import { proccessError } from "@/api/instance";
import { cookies } from "@/utils/cookies";

declare global {
  var io: Socket | undefined;
}

const io = global.io ?? socketIo(SOCKET_URL, { reconnectionDelay: 5000 });
if (process.env.NODE_ENV === "development") global.io = io;

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
    }
  },

  cdc: {
    emit: () => {
      const connectionConfig = cookies.get("connectionConfig");
      io.emit("cdc", {
        headers: { "x-connection-config": connectionConfig }
      });
    },

    off: () => {
      io.emit("cdc.off");
    },

    onData: (callback: (data: CDC) => void) => {
      io.on("cdc.data", callback);
      return () => io.off("cdc.data", callback);
    },

    onError: (callback: (data: unknown) => void) => {
      io.on("cdc.error", callback);
      return () => io.off("cdc.error", callback);
    }
  }
};

export function SocketController() {
  useEffect(() => {
    const listeners: (typeof io.off)[] = [];

    listeners.push(ioEvents.cdc.onError(proccessError));

    return () => {
      listeners.forEach((off) => off?.());
    };
  }, []);

  return null;
}
