import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useShapesWebSocket } from "~/api/useShapesWebSocket.ts";
import { shapeKeys } from "~/api/key-factory.ts";
import { Shape } from "~/shape/CanvasShape.ts";

export const useShapeUpdate = () => {
  const queryClient = useQueryClient();
  const api = useShapesWebSocket();

  const mutation = useMutation({
    mutationFn: api.patch,
    onSettled: async (data) => {
      if (!data) return;
      const { id: shapeId } = data;
      queryClient.setQueryData(shapeKeys.detail(shapeId), data);
      queryClient.setQueryData(shapeKeys.all, (shapes: Shape[]) =>
        shapes.map((shape) => (shape.id === shapeId ? data : shape)),
      );
    },
  });

  const removeMutation = useMutation({
    mutationFn: api.delete,
  });

  return {
    isPending: mutation.isPending,
    update: mutation.mutate,
    variables: mutation.variables,
    remove: removeMutation.mutateAsync,
  };
};
