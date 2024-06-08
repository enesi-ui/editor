import { useQuery } from "@tanstack/react-query";
import { SHAPES_KEY } from "~/shape/useShapes.ts";
import { useShapesWebSocket } from "~/api/useShapesWebSocket.ts";

export const useShape = (id?: string) => {
  const api = useShapesWebSocket();

  const query = useQuery({
    queryKey: [SHAPES_KEY, id],
    queryFn: () => (id ? api.get(id) : null),
    enabled: !!id,
  });

  return {
    ...query,
    shape: query.data,
  };
};
