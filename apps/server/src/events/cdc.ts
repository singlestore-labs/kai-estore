import { IS_DEV } from "@/constants/env";
import { SocketEventsHandler } from "@/services/socket";
import { CDC } from "@/types/data";
import { cdcDataInfo } from "@/utils/cdc";
import { parseConnectionConfigHeader } from "@/utils/connection";
import { createDBConnection } from "@/utils/db";

export const cdcSocketEventsHandler: SocketEventsHandler = (socket) => {
  const onOffHandlers: Record<string, () => void> = {};

  const handleOffHandlers = () => {
    Object.entries(onOffHandlers).forEach(([id, fn]) => {
      if (id === socket.id) fn();
    });
  };

  socket.on("cdc", async (data) => {
    let interval: NodeJS.Timeout | undefined = undefined;

    try {
      const connectionConfig = parseConnectionConfigHeader(data.headers);
      if (!connectionConfig.withCDC) return;

      const { db } = await createDBConnection(connectionConfig);
      const getCDC = () => db.collection<CDC>("cdc").findOne();
      const cdc = await getCDC();

      if (cdc && cdc.status !== "ready") {
        interval = setInterval(async () => {
          const { collectionsCount, isReady } = await cdcDataInfo(db);
          if (IS_DEV) console.log(`socket: ${socket.id}`, "cdc.interval");

          if (isReady) {
            clearInterval(interval);
            const updatedCDC: CDC = { ...cdc, status: "ready" };
            await db
              .collection<CDC>("cdc")
              .updateOne({ _id: cdc._id }, { $set: { status: updatedCDC.status } });
            socket.emit("cdc.data", { cdc: updatedCDC, count: Object.fromEntries(collectionsCount[0]) });
          } else {
            socket.emit("cdc.data", { cdc, count: Object.fromEntries(collectionsCount[0]) });
          }
        }, 5000);

        onOffHandlers[socket.id] = () => clearInterval(interval);
      }

      socket.emit("cdc.data", cdc);
    } catch (error) {
      console.error(error);
      clearInterval(interval);
      socket.emit("cdc.error", error);
    }
  });

  socket.on("cdc.off", handleOffHandlers);

  socket.on("disconnect", handleOffHandlers);
};
