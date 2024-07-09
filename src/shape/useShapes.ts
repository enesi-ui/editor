import { useQuery } from "@tanstack/react-query";
import { useShapesWebSocket } from "~/api/useShapesWebSocket.ts";
import { shapeKeys } from "~/api/key-factory.ts";

export const useShapes = (canvasId: string) => {
  const api = useShapesWebSocket();

  const query = useQuery({
    queryKey: shapeKeys.all,
    queryFn: () => api.getAll(canvasId),
  });

  return {
    shapes: query.data,
    ...query,
  };
};
