import { useWebsocket } from "~/web-sockets/useWebsocket.ts";
import { Selection, SelectionUpdate } from "~/canvas/Selection.ts";
import { useQueryClient } from "@tanstack/react-query";

export const useSelectionWebSocket = () => {
  const webSocket = useWebsocket();
  const queryClient = useQueryClient();
  return {
    get: (canvasId: string): Selection => {
      webSocket.send({
        event: "selection/:canvasId/get",
        data: canvasId,
      });
      return (
        queryClient.getQueryData<Selection>(["selection", canvasId]) ?? {
          canvasId,
          shapeIds: [],
        }
      );
    },

    put: (body: SelectionUpdate): Promise<Selection> => {
      webSocket.send({
        event: "selection/:canvasId/put",
        data: body,
      });
      return Promise.resolve({
        canvasId: body.canvasId,
        shapeIds: body.selectShapes,
      });
    },
  };
};
