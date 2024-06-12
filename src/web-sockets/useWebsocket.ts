import { useContext, useEffect, useRef } from "react";
import { WebSocketContext } from "~/web-sockets/WebSocketContext.ts";

export const useWebsocket = () => {
  const context = useContext(WebSocketContext);
  const queue = useRef<unknown[]>([]);

  useEffect(() => {
    if (!queue.current.length) return;
    const webSocket = context?.webSocket;

    if (!webSocket) return;

    const copy = [...queue.current];
    const toRemove: unknown[] = [];
    copy.forEach((data, index) => {
      if (webSocket?.readyState !== 1) return;
      webSocket.send(JSON.stringify(data));
      toRemove.push(index);
    });

    queue.current = queue.current.filter(
      (_, index) => !toRemove.includes(index),
    );
  }, [context, context?.ready]);

  return {
    send: (data: unknown) =>
      context?.webSocket?.readyState === 1
        ? context?.webSocket.send(JSON.stringify(data))
        : (queue.current = [...queue.current, data]),
  };
};
