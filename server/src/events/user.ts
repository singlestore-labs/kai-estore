import { getUserRecommProductsQuery } from "@/queries/getUserRecommProducts";
import { SocketEventsHandler } from "@/services/socket";
import { parseConnectionConfigCookie } from "@/utils/connection";
import { createDBConnection } from "@/utils/db";
import { withDuration } from "@/utils/helpers";

export const userSocketEventsHandler: SocketEventsHandler = (socket) => {
  socket.on("recomm", async () => {
    try {
      const connectionConfig = parseConnectionConfigCookie(socket.request.headers.cookie);
      const { db, client } = await createDBConnection(connectionConfig);
      socket.emit("recomm.loading", true);
      const data = await withDuration(() => getUserRecommProductsQuery(db, connectionConfig.userId));
      client.close();
      socket.emit("recomm.data", data);
    } catch (error) {
      socket.emit("recomm.error", error);
    }
  });
};
