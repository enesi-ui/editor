import { useContext, useEffect, useState } from "react";
import { WebSocketContext } from "~/web-sockets/WebSocketContext.ts";

export interface WebSocketInterface {
  send: (data: unknown) => void;
  addEventListenerOnce: (callback: (event: MessageEvent) => void) => void;
  ready: boolean;
}
export const useWebsocket = (): WebSocketInterface => {
  const webSocket = useContext(WebSocketContext);
  const [queue, setQueue] = useState<unknown[]>([]);

  useEffect(() => {
    if (queue.length) {
      const copy = [...queue];
      const toRemove: unknown[] = [];
      copy.forEach((data, index) => {
        if (webSocket?.readyState !== 1) return;
        webSocket.send(JSON.stringify(data));
        toRemove.push(index);
      });

      setQueue((prev) => prev.filter((_, index) => !toRemove.includes(index)));
    }

  }, [webSocket, queue]);

  return {
    addEventListenerOnce: (callback: (event: MessageEvent) => void) => {
      webSocket?.addEventListener("message", async (event) => {
        callback(event);
        webSocket.removeEventListener("message", callback);
      });
    },
    ready: webSocket?.readyState === 1,
    send: (data: unknown) =>
      webSocket?.readyState === 1
        ? webSocket?.send(JSON.stringify(data))
        : setQueue((prev) => [...prev, data]),
  };
};
