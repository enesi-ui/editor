import { useContext } from "react";
import { WebSocketContext } from "~/web-sockets/WebSocketContext.ts";

export interface WebSocketInterface {
  send: (data: unknown) => void;
  addEventListenerOnce: (callback: (event: MessageEvent) => void) => void;
  ready: boolean;
}
export const useWebsocket = (): WebSocketInterface => {
  const webSocket = useContext(WebSocketContext);
  return {
    addEventListenerOnce: (callback: (event: MessageEvent) => void) => {
      webSocket?.addEventListener("message", async (event) => {
        callback(event);
        webSocket.removeEventListener("message", callback);
      });
    },
    ready: webSocket?.readyState === 1,
    send: (data: unknown) => webSocket?.readyState === 1 && webSocket?.send(JSON.stringify(data)),
  };
};
