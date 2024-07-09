import { useMutation, useQueryClient } from "@tanstack/react-query";
import { canvasKeys } from "~/api/key-factory.ts";
import { Canvas, useCanvasWebsocket } from "~/canvas/useCanvasWebsocket.ts";

export const useCanvasPost = () => {
  const api = useCanvasWebsocket();

  const client = useQueryClient();

  const mutation = useMutation({
    mutationFn: api.post,
    onSettled: (data) => {
      if (data) {
        client.setQueryData(canvasKeys.all, (canvas: Canvas[]) => [
          ...canvas,
          data,
        ]);
      }
    },
  });

  return {
    post: mutation.mutateAsync,
    postSync: mutation.mutate,
  };
};
