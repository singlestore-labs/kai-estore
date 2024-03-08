import { Server as HTTPServer } from "http";
import { Server, Socket as IoSocket } from "socket.io";

export type Socket = IoSocket;
export type SocketServer = Server;
export type SocketEventsHandler = (socket: Socket) => void;

export let socketServer: SocketServer;

export function initSocket<T extends HTTPServer>(
  server: T,
  onInit?: (socketServer: SocketServer) => void,
  onConnection?: (socket: Socket) => void
) {
  socketServer = new Server(server, { cors: { origin: "*" }, cookie: true });

  socketServer.on("connection", (socket) => {
    onConnection?.(socket);
  });

  onInit?.(socketServer);
}
