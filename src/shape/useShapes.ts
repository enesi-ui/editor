import { useQuery } from "@tanstack/react-query";
import { useShapesWebSocket } from "~/api/useShapesWebSocket.ts";
import { shapeKeys } from "~/api/key-factory.ts";

export const useShapes = () => {
  const api = useShapesWebSocket();

  const query = useQuery({
    queryKey: shapeKeys.all,
    queryFn: api.getAll,
  });

  return {
    shapes: query.data,
    ...query,
  };
};
