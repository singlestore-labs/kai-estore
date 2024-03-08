import { SocketEventsHandler } from "@/services/socket";
import { userSocketEventsHandler } from "./user";
import { cdcSocketEventsHandler } from "@/events/cdc";

export const socketEventsHandler: SocketEventsHandler = (socket) => {
  [userSocketEventsHandler, cdcSocketEventsHandler].forEach((events) => events(socket));
};
