import { SocketEventsHandler } from "@/services/socket";
import { userSocketEventsHandler } from "./user";

export const socketEventsHandler: SocketEventsHandler = (socket) => {
  [userSocketEventsHandler].forEach((events) => events(socket));
};
