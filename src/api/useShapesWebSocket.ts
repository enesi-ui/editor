import { Shape } from "~/shape/CanvasShape.ts";
import { useWebsocket } from "~/web-sockets/useWebsocket.ts";
import { useQueryClient } from "@tanstack/react-query";
import { shapeKeys } from "~/api/key-factory.ts";

export const useShapesWebSocket = () => {
  const webSocket = useWebsocket();
  const client = useQueryClient();
  return {
    delete: (id: string): Promise<void> => {
      webSocket.send({
        event: "shapes/:id/delete",
        data: id,
      });
      return Promise.resolve();
    },

    get: (id: string): Shape | null => {
      webSocket.send({
        event: `shapes/:id/get`,
        data: id,
      });
      return client.getQueryData<Shape>(shapeKeys.detail(id)) ?? null;
    },

    getAll: (canvasId: string): Shape[] => {
      webSocket.send({
        event: "shapes/get",
        data: canvasId,
      });
      return client.getQueryData<Shape[]>(shapeKeys.all) ?? [];
    },

    post: (body: Omit<Shape, "id">): Promise<Shape> => {
      return new Promise((resolve) => {
        webSocket.listenOnce((data: { data: Shape }) => {
          resolve(data.data);
        });
        webSocket.send({
          event: "shapes/post",
          data: body,
        });
      });
    },

    patch: (body: Partial<Shape> & { id: string }): Promise<Shape> => {
      return new Promise((resolve) => {
        webSocket.listenOnce((data: { data: Shape }) => {
          resolve(data.data);
        });
        webSocket.send({
          event: "shapes/:id/patch",
          data: body,
        });
      });
    },
  };
};
