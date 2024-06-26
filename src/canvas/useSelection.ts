import { useMutation, useQuery } from "@tanstack/react-query";
import { useSelectionWebSocket } from "~/api/useSelectionWebSocket.ts";

export const CANVASID = "canvasId";
export const useSelection = () => {
  const api = useSelectionWebSocket();

  const { data } = useQuery({
    queryKey: ["selection", CANVASID],
    queryFn: () => api.get(CANVASID),
  });

  const mutation = useMutation({
    mutationKey: ["selection", CANVASID],
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
    console.log("deselectAllSelect", shapeId);
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
