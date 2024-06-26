import { useMutation } from "@tanstack/react-query";
import { useShapesWebSocket } from "~/api/useShapesWebSocket.ts";

export const useShapesPost = () => {
  const api = useShapesWebSocket();

  const mutation = useMutation({
    mutationFn: api.post,
  });

  return {
    post: mutation.mutateAsync,
    postSync: mutation.mutate,
  };
};
