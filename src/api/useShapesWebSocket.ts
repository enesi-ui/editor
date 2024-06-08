import { Shape } from "~/shape/CanvasShape.ts";
import { useWebsocket } from "~/web-sockets/useWebsocket.ts";

export const useShapesWebSocket = () => {
  const webSocket = useWebsocket();
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
      return null;
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

    put: (body: Shape): Promise<{ id: string }> => {
      webSocket.send({
        event: "shapes/:id/put",
        data: body,
      });
      return Promise.resolve({ id: body.id });
    },
  };
};
