import { Shape } from "~/shape/CanvasShape.ts";
import { useWebsocket } from "~/web-sockets/useWebsocket.ts";
import { useQueryClient } from "@tanstack/react-query";

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
      return client.getQueryData<Shape>(["shapes", id]) ?? null;
    },

    getAll: (): Shape[] => {
      webSocket.send({
        event: "shapes/get",
      });
      return [];
    },

    post: (body: Omit<Shape, "id">) => {
      webSocket.send({
        event: "shapes/post",
        data: body,
      });
      return Promise.resolve();
    },

    patch: (body: Partial<Shape> & { id: string }): Promise<Shape> => {
      webSocket.send({
        event: "shapes/:id/patch",
        data: body,
      });
      const shape = client.getQueryData<Shape>(["shapes", body.id]);
      return Promise.resolve({ shape, ...body } as Shape);
    },
  };
};
