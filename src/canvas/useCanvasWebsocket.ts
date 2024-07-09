import { useWebsocket } from "~/web-sockets/useWebsocket.ts";
import { useQueryClient } from "@tanstack/react-query";
import { canvasKeys } from "~/api/key-factory.ts";

export interface Canvas {
  id: string;
  name: string;
}

export const useCanvasWebsocket = () => {
  const webSocket = useWebsocket();
  const client = useQueryClient();
  return {
    getAll: (): Canvas[] => {
      webSocket.send({
        event: `canvases/get`,
      });
      return client.getQueryData<Canvas[]>(canvasKeys.all) ?? [];
    },

    post: (body: Omit<Canvas, "id">): Promise<Canvas> => {
      return new Promise((resolve) => {
        webSocket.listenOnce((data: { data: Canvas }) => {
          resolve(data.data);
        });
        webSocket.send({
          event: `canvases/post`,
          data: body,
        });
      });
    },
  };
};
