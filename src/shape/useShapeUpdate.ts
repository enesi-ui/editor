import { useMutation } from "@tanstack/react-query";
import { useShapesWebSocket } from "~/api/useShapesWebSocket.ts";

export const useShapeUpdate = () => {
  const api = useShapesWebSocket();

  const mutation = useMutation({
    mutationFn: api.patch,
  });

  const removeMutation = useMutation({
    mutationFn: api.delete,
  });

  return {
    update: mutation.mutateAsync,
    remove: removeMutation.mutateAsync,
  };
};
