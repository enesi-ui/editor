import { createContext } from "react";

export const webSocket = new WebSocket(import.meta.env.VITE_APP_WS_URL as string);
export const WebSocketContext = createContext<WebSocket | undefined>(undefined);
