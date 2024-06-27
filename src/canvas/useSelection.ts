import { useMutation, useQuery } from "@tanstack/react-query";
import { useSelectionWebSocket } from "~/api/useSelectionWebSocket.ts";
import { selectionKeys } from "~/api/key-factory.ts";

export const CANVASID = "canvasId";
export const useSelection = () => {
  const api = useSelectionWebSocket();

  const { data } = useQuery({
    queryKey: selectionKeys.canvas(CANVASID),
    queryFn: () => api.get(CANVASID),
  });

  const mutation = useMutation({
    mutationFn: api.put,
  });

  const deselectAll = async () => {
    await mutation.mutateAsync({
      canvasId: CANVASID,
      selectShapes: [],
      deselectShapes: [],
      deselectAll: true,
    });
  };

  const deselectAllSelect = async (shapeId: string) => {
    await mutation.mutateAsync({
      canvasId: CANVASID,
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
