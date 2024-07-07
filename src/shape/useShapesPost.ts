import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useShapesWebSocket } from "~/api/useShapesWebSocket.ts";
import { shapeKeys } from "~/api/key-factory.ts";
import { Shape } from "~/shape/CanvasShape.ts";

export const useShapesPost = () => {
  const api = useShapesWebSocket();

  const client = useQueryClient();

  const mutation = useMutation({
    mutationFn: api.post,
    onSettled: (data) => {
      if (data) {
        client.setQueryData(shapeKeys.all, (shapes: Shape[]) => [...shapes, data]);
      }
    },
  });

  return {
    post: mutation.mutateAsync,
    postSync: mutation.mutate,
  };
};
