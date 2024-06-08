import { useMutation } from "@tanstack/react-query";
import { useShapesWebSocket } from "~/api/useShapesWebSocket.ts";

export const useShapeRemove = () => {
  const api = useShapesWebSocket();

  const mutation = useMutation({
    mutationFn: api.delete,
  });

  return {
    remove: mutation.mutateAsync,
  };
};
