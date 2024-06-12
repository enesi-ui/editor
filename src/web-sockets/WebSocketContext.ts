import { createContext } from "react";

export interface WebSocketInterface {
  webSocket: WebSocket;
  name: string;
  ready: boolean;
}
export const WebSocketContext = createContext<WebSocketInterface | undefined>(
  undefined,
);
