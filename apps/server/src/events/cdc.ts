import { IS_DEV } from "@/constants/env";
import { SocketEventsHandler } from "@/services/socket";
import { CDC } from "@/types/data";
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
        const requiredCollectionNames = ["categories", "orders", "products", "ratings", "tags", "users"];
        const { db: sourceDB } = await createDBConnection();

        interval = setInterval(async () => {
          const collectionsCount = await Promise.all(
            [db, sourceDB].map((db) => {
              return Promise.all(
                requiredCollectionNames.map(async (collection) => {
                  return [collection, await db.collection(collection).countDocuments()] as const;
                })
              );
            })
          );

          const areEqual = areDbCollectionsEqual(...collectionsCount.map((db) => db.map((i) => i[1])));

          if (IS_DEV) console.log(`socket: ${socket.id}`, "cdc.interval");

          if (areEqual) {
            clearInterval(interval);
            const updatedCDC: CDC = { ...cdc, status: "ready" };
            await db.collection<CDC>("cdc").updateOne({ _id: cdc._id }, { $set: updatedCDC });
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

function areDbCollectionsEqual<T extends any[][] = any[][]>(...dbCollectionsCount: T): boolean {
  if (dbCollectionsCount.length <= 1) return true;
  const referencedCollection = dbCollectionsCount[0];

  for (let collection of dbCollectionsCount.slice(1)) {
    if (collection.length !== referencedCollection.length) {
      return false;
    }

    for (const [i, item] of collection.entries())
      if (item !== referencedCollection[i]) {
        return false;
      }
  }

  return true;
}
