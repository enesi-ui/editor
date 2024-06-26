import { useQueries, useQuery, UseQueryResult } from "@tanstack/react-query";
import { useShapesWebSocket } from "~/api/useShapesWebSocket.ts";
import notEmpty from "~/utility/notEmpty.ts";
import { Shape } from "~/shape/CanvasShape.ts";
import { shapeKeys } from "~/api/key-factory.ts";

export const useShapes = () => {
  const api = useShapesWebSocket();

  const queryAll = useQuery({
    queryKey: shapeKeys.all,
    queryFn: api.getAll,
    structuralSharing: false,
  });

  function combine(results: UseQueryResult<Shape | null>[]) {
    return results.map((r) => r.data).filter(notEmpty);
  }

  const data = useQueries({
    queries:
      queryAll.data?.map((shape) => ({
        queryKey: shapeKeys.detail(shape.id),
        queryFn: () => api.get(shape.id),
        initialData: shape,
        structuralSharing: false,
      })) ?? [],
    combine,
  });

  return {
    shapes: data.length ? data : undefined,
  };
};
