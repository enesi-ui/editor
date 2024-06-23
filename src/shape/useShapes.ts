import { useQueries, useQuery, UseQueryResult } from "@tanstack/react-query";
import { useShapesWebSocket } from "~/api/useShapesWebSocket.ts";
import notEmpty from "~/utility/notEmpty.ts";
import { Shape } from "~/shape/CanvasShape.ts";

export const SHAPES_KEY = "shapes";
export const useShapes = () => {
  const api = useShapesWebSocket();

  const queryAll = useQuery({
    queryKey: [SHAPES_KEY],
    queryFn: api.getAll,

  });

  function combine(results: UseQueryResult<Shape | null>[]) {
    return results.map((r) => r.data).filter(notEmpty);
  }

  const data = useQueries({
    queries:
      queryAll.data?.map((shape) => ({
        queryKey: [SHAPES_KEY, shape.id],
        queryFn: () => api.get(shape.id),
        structuralSharing: false,
      })) ?? [],
    combine,
  });

  return {
    shapes: data.length ? data : undefined,
  };
};
