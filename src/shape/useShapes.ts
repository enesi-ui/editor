import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { useShapesWebSocket } from "~/api/useShapesWebSocket.ts";

export const SHAPES_KEY = "shapes";
export const useShapes = () => {
  const api = useShapesWebSocket();

  const queryAll = useQuery({
    queryKey: [SHAPES_KEY],
    queryFn: api.getAll,
  });

  const query = useQueries({
    queries:
      queryAll.data?.map((shape) => ({
        queryKey: [SHAPES_KEY, shape.id],
        queryFn: () => api.get(shape.id),
      })) ?? [],
  });

  const mutation = useMutation({
    mutationFn: api.post,
  });

  return {
    ...query,
    shapes: query.map((q) => q.data),
    post: mutation.mutateAsync,
    postSync: mutation.mutate,
  };
};
