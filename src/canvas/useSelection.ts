import { useMutation, useQuery } from "@tanstack/react-query";
import { useSelectionWebSocket } from "~/api/useSelectionWebSocket.ts";
import { selectionKeys } from "~/api/key-factory.ts";

export const useSelection = (canvasId: string) => {
  const api = useSelectionWebSocket();

  const { data } = useQuery({
    queryKey: selectionKeys.canvas(canvasId),
    queryFn: () => api.get(canvasId),
  });

  const mutation = useMutation({
    mutationFn: api.put,
  });

  const deselectAll = async () => {
    await mutation.mutateAsync({
      canvasId,
      selectShapes: [],
      deselectShapes: [],
      deselectAll: true,
    });
  };

  const deselectAllSelect = (shapeId: string) => {
    mutation.mutate({
      canvasId,
      selectShapes: [shapeId],
      deselectShapes: [],
      deselectAll: true,
    });
  };

  return {
    selectedShapes: data?.shapeIds.length ? data.shapeIds : undefined,
    deselectAllSelect,
    deselectAll,
  };
};
