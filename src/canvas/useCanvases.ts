import { useQuery } from "@tanstack/react-query";
import { canvasKeys } from "~/api/key-factory.ts";
import { useCanvasWebsocket } from "~/canvas/useCanvasWebsocket.ts";

export const useCanvases = () => {
  const api = useCanvasWebsocket();
  const query = useQuery({
    queryKey: canvasKeys.all,
    queryFn: api.getAll,
  });

  return {
    canvases: query.data,
    ...query,
  };
};
