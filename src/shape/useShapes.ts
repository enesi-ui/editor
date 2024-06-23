import { useQueries, useQuery } from "@tanstack/react-query";
import { useShapesWebSocket } from "~/api/useShapesWebSocket.ts";
import notEmpty from "~/utility/notEmpty.ts";

export const SHAPES_KEY = "shapes";
export const useShapes = () => {
  const api = useShapesWebSocket();

  const queryAll = useQuery({
    queryKey: [SHAPES_KEY],
    queryFn: api.getAll,
  });

  const data = useQueries({
    queries:
      queryAll.data?.map((shape) => ({
        queryKey: [SHAPES_KEY, shape.id],
        queryFn: () => api.get(shape.id),
      })) ?? [],
    combine: (results) => results.map((r) => r.data).filter(notEmpty),
  });

  return {
    shapes: data.length ? data : undefined,
  };
};
