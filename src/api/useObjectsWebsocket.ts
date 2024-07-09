import { useWebsocket } from "~/web-sockets/useWebsocket.ts";
import { useQueryClient } from "@tanstack/react-query";
import { objectKeys } from "~/api/key-factory.ts";
import { EnesiObject } from "~/enesi-object/EnesiObject.ts";

export const useObjectsWebsocket = () => {
  const webSocket = useWebsocket();
  const client = useQueryClient();
  return {
    get: (id: string): EnesiObject | null => {
      webSocket.send({
        event: `objects/:id/get`,
        data: id,
      });
      return client.getQueryData<EnesiObject>(objectKeys.detail(id)) ?? null;
    },

    getAll: (canvasId: string): EnesiObject[] => {
      webSocket.send({
        event: "objects/get",
        data: canvasId,
      });
      return client.getQueryData<EnesiObject[]>(objectKeys.all) ?? [];
    },

    patchZIndex: (body: {
      id: string;
      aboveObjectId: string;
      belowObjectId?: string;
    }): Promise<EnesiObject> => {
      return new Promise((resolve) => {
        webSocket.listenOnce((data: { data: EnesiObject }) => {
          resolve(data.data);
        });
        webSocket.send({
          event: "objects/:id/z-index/patch",
          data: body,
        });
      });
    },

    patch: (body: Partial<EnesiObject> & { id: string }): Promise<EnesiObject> => {
      return new Promise((resolve) => {
        webSocket.listenOnce((data: { data: EnesiObject }) => {
          resolve(data.data);
        });
        webSocket.send({
          event: "objects/:id/patch",
          data: body,
        });
      });
    }
  };
};
