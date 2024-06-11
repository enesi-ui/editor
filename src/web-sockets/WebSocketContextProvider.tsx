import { ReactNode, useEffect } from "react";

import { webSocket, WebSocketContext } from "~/web-sockets/WebSocketContext.ts";
import { useQueryClient } from "@tanstack/react-query";
import { extractQueryKeys } from "~/api/extract-query-key.ts";
export const WebSocketContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!webSocket) return;
    webSocket.addEventListener("message", async (event) => {
      const data = JSON.parse(event.data.toString());
      if (!data.data) return;
      const { keys, method } = extractQueryKeys(data);
      if (method === "post") {
        await queryClient.invalidateQueries({ queryKey: keys });
        return;
      }
      queryClient.setQueryData(keys, data.data);
    });
  }, [queryClient]);

  return (
    <WebSocketContext.Provider value={webSocket}>
      {children}
    </WebSocketContext.Provider>
  );
};
