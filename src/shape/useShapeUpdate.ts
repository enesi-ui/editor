import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useShapesWebSocket } from "~/api/useShapesWebSocket.ts";
import { shapeKeys } from "~/api/key-factory.ts";

export const useShapeUpdate = () => {
  const queryClient = useQueryClient();
  const api = useShapesWebSocket();

  const mutation = useMutation({
    mutationFn: api.patch,
    onSettled: async (data) => {
      if (!data) return;
      const { id: shapeId } = data;
      await queryClient.invalidateQueries({ queryKey: shapeKeys.detail(shapeId) });
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
