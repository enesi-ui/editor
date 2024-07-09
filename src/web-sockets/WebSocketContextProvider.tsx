import { ReactNode, useEffect, useRef, useState } from "react";

import {
  WebSocketContext,
  WebSocketInterface,
} from "~/web-sockets/WebSocketContext.ts";
import { useQueryClient } from "@tanstack/react-query";
import { extractQueryKeys } from "~/api/extract-query-key.ts";

function makeid(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export const WebSocketContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const queryClient = useQueryClient();
  const [ready, setReady] = useState(false);

  const webSocket = useRef<WebSocket | undefined>(undefined);

  useEffect(() => {
    const current = new WebSocket(
      (import.meta.env.VITE_APP_WS_URL as string) || "ws://localhost:8082",
    );
    current.addEventListener("open", () => {
      setReady(true);
    });
    current.addEventListener("close", () => {
      setReady(false);
    });
    current.addEventListener("message", async (event) => {
      const data = JSON.parse(event.data.toString());

      if (!data.data) return;

      if (data.event.includes('error')) {
        console.error(data.data);
        return;
      }

      const { keys } = extractQueryKeys(data);

      queryClient.setQueryData(keys, data.data);


    });

    webSocket.current = current;

    return () => {
      current.close();
    };
  }, [queryClient]);

  if (!webSocket.current) return null;

  const value: WebSocketInterface = {
    webSocket: webSocket.current,
    name: makeid(5),
    ready,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
